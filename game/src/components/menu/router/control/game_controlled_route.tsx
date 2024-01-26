import { Navigate, Outlet } from "react-router-dom";
import { useGameSession } from "../../../../hooks/use_game_session";

interface GameControlledRouteParams {
    requiresActiveSession?: boolean;
    redirectPath?: string;

    children?: React.ReactNode;
}

const GameControlledRoute: React.FC<GameControlledRouteParams> = ({ children, requiresActiveSession, redirectPath = '/'}) => {

    const { connection } = useGameSession();

    if (requiresActiveSession && !connection) return <Navigate to={redirectPath} replace />;

    return (
        <>{children || <Outlet/>}</>
    )
}

export default GameControlledRoute;

