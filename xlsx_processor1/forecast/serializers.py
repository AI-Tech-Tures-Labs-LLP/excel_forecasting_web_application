from .models import ProductDetail, MonthlyForecast, StoreForecast, ComForecast, OmniForecast, ForecastNote, SheetUpload
from rest_framework import serializers
import math
# Serializer for ProductDetail
class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetail
        fields = '__all__'

# Serializer for MonthlyForecast
class MonthlyForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyForecast
        fields = '__all__'

class FloatHandlingSerializerMixin:
    """Mixin to handle infinite float values in serialization"""
    
    def to_representation(self, instance):
        """Override to_representation to handle infinite values"""
        ret = super().to_representation(instance)
        
        # Iterate through all fields
        for field_name, field_value in ret.items():
            # Check if it's a float and if it's infinite
            if isinstance(field_value, float) and (math.isinf(field_value) or math.isnan(field_value)):
                if math.isinf(field_value):
                    # Replace infinity with a very large number or null
                    if field_value > 0:
                        ret[field_name] = None  # or use a large number like 1e308
                    else:
                        ret[field_name] = None  # or use a large negative number like -1e308
                else:  # isnan
                    ret[field_name] = None
        
        return ret



from .models import ForecastNote, Notification

class ForecastNoteSerializer(serializers.ModelSerializer):
    tagged_to_usernames = serializers.StringRelatedField(source='tagged_to', many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    product_id = serializers.CharField(source='productdetail.product_id', read_only=True)
    
    class Meta:
        model = ForecastNote
        fields = [
            'id', 'sheet', 'productdetail', 'note', 'tagged_to', 
            'created_by', 'created_at', 'updated_at',
            'tagged_to_usernames', 'created_by_username', 'created_by_name', 'product_id'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None


class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_name = serializers.SerializerMethodField()
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'message', 'is_read', 'read_at', 'created_at',
            'sender_username', 'sender_name', 'recipient_username'
        ]
        read_only_fields = ['created_at', 'read_at']
    
    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.get_full_name() or obj.sender.username
        return None



class StoreForecastSerializer(FloatHandlingSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = StoreForecast
        fields = '__all__'

class ComForecastSerializer(FloatHandlingSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ComForecast
        fields = '__all__'

class OmniForecastSerializer(FloatHandlingSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = OmniForecast
        fields = '__all__'

class SheetUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SheetUpload
        fields = '__all__'
