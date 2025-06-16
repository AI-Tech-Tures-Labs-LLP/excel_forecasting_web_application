from rest_framework import permissions

class IsRoleAdmin(permissions.BasePermission):
    """
    Allows access only to users with role ID 1 (admin).
    """


    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user.role, "name", "").lower() == "admin"
        )