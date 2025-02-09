import { useRef } from "react";
import { useParams } from "react-router-dom";
import ReactHlsPlayer from "react-hls-player";

export default function LivestreamViewer() {
    const { id: roomId } = useParams<{ id: string }>();
    const playerRef = useRef<any>();

    return (
        <section>
            <ReactHlsPlayer
                src={""}
                autoPlay={false}
                controls={true}
                width="100%"
                height="auto"
                playerRef={playerRef}
            />
        </section>
    );
}
