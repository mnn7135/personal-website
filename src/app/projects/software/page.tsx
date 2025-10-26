import InfoCard from '@/components/personal-website/info-card';
import InfoListCard from '@/components/personal-website/info-list-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function SoftwarePage() {
    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.PROJECT_SECTION}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <InfoCard
                    cardTitle={config.PROJECT_1_TITLE}
                    secondaryTitle={config.PROJECT_1_SKILLS}
                    cardDescription={config.PROJECT_1_TIMEFRAME}
                    center={true}
                >
                    <InfoListCard data={config.PROJECT_1_DESCRIPTION}></InfoListCard>
                </InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_2_TITLE}
                    secondaryTitle={config.PROJECT_2_SKILLS}
                    cardDescription={config.PROJECT_2_TIMEFRAME}
                    center={true}
                >
                    <InfoListCard data={config.PROJECT_2_DESCRIPTION}></InfoListCard>
                </InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_3_TITLE}
                    secondaryTitle={config.PROJECT_3_SKILLS}
                    cardDescription={config.PROJECT_3_TIMEFRAME}
                    center={true}
                >
                    <InfoListCard data={config.PROJECT_3_DESCRIPTION}></InfoListCard>
                </InfoCard>
            </div>
            <br></br>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <InfoCard
                    cardTitle={config.PROJECT_4_TITLE}
                    secondaryTitle={config.PROJECT_4_SKILLS}
                    cardDescription={config.PROJECT_4_TIMEFRAME}
                    center={true}
                >
                    <InfoListCard data={config.PROJECT_4_DESCRIPTION}></InfoListCard>
                </InfoCard>
            </div>
        </div>
    );
}
