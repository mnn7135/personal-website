import { IAppConfig, loadAppConfig } from "@/services/configs/app-config.service";
import HomePage from "./home/page";

const config: IAppConfig = loadAppConfig();

export default function Home() {
    return (
        <HomePage></HomePage>
    );
}
