import { Limiter } from "@/shared/components/Limiter";
import { Menu } from "@/shared/components/Menu";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="page">
            <Menu />
            <Limiter>{children}</Limiter>
        </div>
    );
}
