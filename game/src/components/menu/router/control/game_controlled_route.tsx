import { Navigate, Outlet } from "react-router-dom";
import { useGameSession } from "../../../../hooks/use_game_session";

interface GameControlledRouteParams {
    requiresActiveSession?: boolean;
    requiresActiveLobby?: boolean;
    requiresActiveGameSession?: boolean;

    redirectPath?: string;
    children?: React.ReactNode;
}

const GameControlledRoute: React.FC<GameControlledRouteParams> = ({ children, requiresActiveSession, requiresActiveLobby, requiresActiveGameSession, redirectPath = '/'}) => {

    const { connection, currentLobby, currentGameSession } = useGameSession();

    if (requiresActiveSession && !connection) return <Navigate to={redirectPath} replace />;
    if (requiresActiveLobby && !currentLobby) return <Navigate to={redirectPath} replace />;
    if (requiresActiveGameSession && !currentGameSession) return <Navigate to={redirectPath} replace />;

    return (
        <>{children || <Outlet/>}</>
    )
}

export default GameControlledRoute;

