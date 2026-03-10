import { Text } from "@/components/Text";
import { AccountSkeleton } from "./_components/AccountSkeleton";

import styles from "./AccountPage.module.scss";

export default function Loading() {
    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Аккаунт
            </Text>
            <AccountSkeleton />
        </>
    );
}
