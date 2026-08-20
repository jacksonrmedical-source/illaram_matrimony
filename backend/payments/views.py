import razorpay
import os
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import SubscriptionPlan, Payment
from .serializers import SubscriptionPlanSerializer, PaymentSerializer


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]
    queryset = SubscriptionPlan.objects.filter(is_active=True)


class PaymentViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_razorpay_client(self):
        key_id = os.getenv('RAZORPAY_KEY_ID', '')
        key_secret = os.getenv('RAZORPAY_KEY_SECRET', '')
        if not key_id or not key_secret:
            raise ValueError("Razorpay credentials not configured")
        return razorpay.Client(auth=(key_id, key_secret))

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({"detail": "plan_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({"detail": "Invalid plan."}, status=status.HTTP_400_BAD_REQUEST)

        amount_paise = plan.price_inr * 100
        payment = Payment.objects.create(user=request.user, plan=plan, amount=amount_paise)

        try:
            client = self.get_razorpay_client()
            razorpay_order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt": str(payment.id),
                "notes": {"user_id": str(request.user.id)}
            })
        except Exception as e:
            payment.status = Payment.Status.FAILED
            payment.save()
            return Response({"detail": f"Razorpay order creation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        payment.razorpay_order_id = razorpay_order['id']
        payment.save()

        return Response({
            "order_id": razorpay_order['id'],
            "amount": amount_paise,
            "currency": "INR",
            "key": os.getenv('RAZORPAY_KEY_ID', ''),
            "payment_id": str(payment.id)
        })

    @action(detail=False, methods=['post'])
    def verify(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail": "Missing payment details."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"detail": "Payment record not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            client = self.get_razorpay_client()
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except Exception:
            payment.status = Payment.Status.FAILED
            payment.save()
            return Response({"detail": "Signature verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = Payment.Status.SUCCESS
        payment.save()

        user = request.user
        user.is_premium = True
        if payment.plan:
            duration_days = payment.plan.duration_days
            if user.premium_expiry and user.premium_expiry > timezone.now():
                user.premium_expiry = user.premium_expiry + timedelta(days=duration_days)
            else:
                user.premium_expiry = timezone.now() + timedelta(days=duration_days)
        else:
            user.premium_expiry = timezone.now() + timedelta(days=30)
        user.save()

        return Response({"detail": "Payment successful. Premium activated."})