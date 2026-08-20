from rest_framework import serializers
from .models import SubscriptionPlan, Payment


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'price_inr', 'duration_days', 'is_active']


class PaymentSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'plan', 'plan_name', 'razorpay_order_id', 'razorpay_payment_id', 'amount', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'status', 'created_at']