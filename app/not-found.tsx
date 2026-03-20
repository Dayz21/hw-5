import { Menu } from "@components/Menu";
import { Limiter } from "@components/Limiter";
import NotFoundPage from "@/shared/components/NotFound";

export default function NotFound() {
    return (
        <div className="page">
            <Menu />
            <Limiter>
                <NotFoundPage />
            </Limiter>
        </div>
    );
}
