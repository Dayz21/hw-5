import { Limiter } from "@/components/Limiter";
import { Menu } from "@/components/Menu";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="page">
            <Menu />
            <Limiter>{children}</Limiter>
        </div>
    );
}
