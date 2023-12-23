import { useLocation } from "react-router-dom";

export default function Profile(props) {
    const location = useLocation();
    let { id: userId, displayName } = location.state;

    return (
        <div>{displayName}</div>
    );
}
