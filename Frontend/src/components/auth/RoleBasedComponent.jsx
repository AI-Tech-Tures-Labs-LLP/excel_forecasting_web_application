import { useSelector } from "react-redux";
import { selectHasPermission, selectUserRole } from "../../redux/authSlice";

const RoleBasedComponent = ({
  children,
  allowedRoles = [],
  requiredPermission = null,
  fallback = null,
}) => {
  const userRole = useSelector(selectUserRole);
  const hasPermission = useSelector((state) =>
    requiredPermission ? selectHasPermission(state, requiredPermission) : true
  );

  const hasAccess = () => {
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return false;
    }

    if (requiredPermission && !hasPermission) {
      return false;
    }

    return true;
  };

  if (!hasAccess()) {
    return fallback;
  }

  return children;
};

export default RoleBasedComponent;
