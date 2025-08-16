import InfoCard from '@/components/personal-website/info-card';
import InfoListCard from '@/components/personal-website/info-list-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function AboutPage() {
    return (
        <div>
            <div>
                <div>
                    <div className="p-2 text-3xl font-bold">{config.ABOUT_TITLE}</div>
                    <PaddingBar></PaddingBar>
                    <div>
                        <div className="place-self-center p-4">
                            <Avatar className="h-75 w-75">
                                <AvatarImage
                                    src={
                                        'https://lh3.googleusercontent.com/a/ACg8ocINab9khEXa2QVb4Zr5K1SQzbL0MviwvnQ8K0PNhcGNFuaY5Mim=s360-c-no'
                                    }
                                    alt="User profile picture"
                                />

                                <AvatarFallback>{'MN'}</AvatarFallback>
                            </Avatar>
                        </div>
                        <InfoCard
                            cardTitle={config.ABOUT_SECTION}
                            cardDescription={config.ABOUT_DESCRIPTION}
                            center={true}
                            stretch={true}
                        ></InfoCard>
                        <br></br>
                        <div className="flex flex-row flex-wrap place-content-between">
                            <InfoCard
                                cardTitle={config.SMALL_BLURB_SECTION}
                                cardDescription={config.SMALL_BLURB_DESCRIPTION}
                                center={true}
                            ></InfoCard>
                            <InfoCard
                                cardTitle={config.NAME}
                                secondaryTitle={config.MINOR_DEGREE}
                                ternaryTitle={config.DEGREE}
                                cardDescription={config.RELEVANT_COURSEWORK}
                                center={true}
                            ></InfoCard>
                            <InfoCard
                                cardTitle={config.OBJECTIVE_SECTION}
                                cardDescription={config.OBJECTIVE_DESCRIPTION}
                                center={true}
                            ></InfoCard>
                        </div>
                        <br></br>
                        <div className="p-2 text-center text-2xl">{config.SKILLS_SECTION}</div>
                        <SmallPaddingBar></SmallPaddingBar>
                        <br></br>
                        <div className="flex flex-row flex-wrap place-content-between">
                            <InfoListCard
                                cardTitle={config.OTHER_SKILLS_SECTION}
                                data={config.OTHER_SKILLS_LIST}
                                center={true}
                            ></InfoListCard>
                            <InfoListCard
                                cardTitle={config.PROGRAMMING_SKILLS_SECTION}
                                data={config.PROGRAMMING_SKILLS_LIST}
                                center={true}
                            ></InfoListCard>
                            <InfoListCard
                                cardTitle={config.OTHER_TECH_SKILLS_SECTION}
                                data={config.OTHER_TECH_SKILLS_LIST}
                                center={true}
                            ></InfoListCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
