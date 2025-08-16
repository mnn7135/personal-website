import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import Image from 'next/image';

const config: IAppConfig = loadAppConfig();
const IMAGE_HEIGHT = 500;
const IMAGE_WIDTH = 1000;

export default function AstronomyPage() {
    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.ASTRONOMY_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <InfoCard stretch={true}></InfoCard>
            <br></br>
            <div className="flex flex-col flex-wrap place-content-center-safe">
                <Image
                    src={config.ASTRONOMY_IMG_1_SRC}
                    alt={config.ASTRONOMY_IMG_2_ALT}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="rounded border-4 border-black"
                ></Image>
                <br></br>
                <Image
                    src={config.ASTRONOMY_IMG_2_SRC}
                    alt={config.ASTRONOMY_IMG_2_ALT}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="rounded border-4 border-black"
                ></Image>
                <br></br>
                <Image
                    src={config.ASTRONOMY_IMG_3_SRC}
                    alt={config.ASTRONOMY_IMG_3_ALT}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="rounded border-4 border-black"
                ></Image>
            </div>
        </div>
    );
}
