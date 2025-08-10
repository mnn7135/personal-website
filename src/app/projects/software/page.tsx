import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function SoftwarePage() {
    return (
        <div>
            <div className="p-2 text-3xl">{config.PROJECT_SECTION}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-between">
                <InfoCard
                    cardTitle={config.PROJECT_1_TITLE}
                    secondaryTitle={config.PROJECT_1_SKILLS}
                    cardDescription={config.PROJECT_1_DESCRIPTION}
                    center={true}
                ></InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_2_TITLE}
                    secondaryTitle={config.PROJECT_2_SKILLS}
                    cardDescription={config.PROJECT_2_DESCRIPTION}
                    center={true}
                ></InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_3_TITLE}
                    secondaryTitle={config.PROJECT_3_SKILLS}
                    cardDescription={config.PROJECT_3_DESCRIPTION}
                    center={true}
                ></InfoCard>
            </div>
        </div>
    );
}
