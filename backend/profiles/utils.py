from profiles.models import IndividualProfile
from moderation.models import Block

def exclude_blocked_profiles(queryset, user_profile):
    if not user_profile:
        return queryset
    blocked_ids = Block.objects.filter(blocker=user_profile).values_list('blocked_id', flat=True)
    blocked_by_ids = Block.objects.filter(blocked=user_profile).values_list('blocker_id', flat=True)
    return queryset.exclude(id__in=blocked_ids).exclude(id__in=blocked_by_ids)