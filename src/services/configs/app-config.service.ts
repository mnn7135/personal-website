import appConfig from './json/app-config.json';

export interface IAppConfig {
    // About Page
    ABOUT_TITLE: string;

    OBJECTIVE_SECTION: string;
    OBJECTIVE_DESCRIPTION: string;

    ABOUT_SECTION: string;
    ABOUT_DESCRIPTION: string;

    NAME: string;
    MINOR_DEGREE: string;
    RELEVANT_COURSEWORK: string;
    DEGREE: string;

    SMALL_BLURB_SECTION: string;
    SMALL_BLURB_DESCRIPTION: string;

    SKILLS_SECTION: string;
    PROGRAMMING_SKILLS_SECTION: string;
    OTHER_TECH_SKILLS_SECTION: string;
    OTHER_SKILLS_SECTION: string;
    PROGRAMMING_SKILLS_LIST: string[];
    OTHER_TECH_SKILLS_LIST: string[];
    OTHER_SKILLS_LIST: string[];

    PROJECT_SECTION: string;
    PROJECT_1_TITLE: string;
    PROJECT_1_SKILLS: string;
    PROJECT_1_DESCRIPTION: string;
    PROJECT_2_TITLE: string;
    PROJECT_2_SKILLS: string;
    PROJECT_2_DESCRIPTION: string;
    PROJECT_3_TITLE: string;
    PROJECT_3_SKILLS: string;
    PROJECT_3_DESCRIPTION: string;

    // Astronony Page
    ASTRONOMY_TITLE: string;
    ASTRONOMY_IMG_1_ALT: string;
    ASTRONOMY_IMG_2_ALT: string;
    ASTRONOMY_IMG_3_ALT: string;
    ASTRONOMY_IMG_1_SRC: string;
    ASTRONOMY_IMG_2_SRC: string;
    ASTRONOMY_IMG_3_SRC: string;

    // Weather Page
    WEATHER_TITLE: string;
    RIGHT_NOW_SECTION: string;
    LATER_SECTION: string;
    FORECAST_SECTION: string;
    TOMORROW_CARD: string;
    TWO_DAY_CARD: string;
    THREE_DAY_CARD: string;
    FEELS_LIKE_LABEL: string;
    HIGH_LABEL: string;
    LOW_LABEL: string;
    WIND_LABEL: string;
    DEGREE_FAHRENHEIGHT: string;
    RIGHT_NOW_CONDITIONS_SECTION: string;
    INCHES: string;
    PRESSURE_MBAR: string;
    WIND_SPEED_MPH: string;
    WIND_SPEED_MPH_DIR: string;
    WEATHER_DATA_LABELS_LIST: string[];
    SUNRISE_SUNSET_DISCLAIMER: string;
    MBAR_DISCLAIMER: string;
    LIVE_DATA_SECTION: string;
    LAST_PULL_FROM: string;
    LAST_MAINTENANCE: string;
    WEATHER_STATION_DISCLAIMER: string;

    // Home Page
    BING_IMG_SRC: string;
    FIRST_IMG_SRC: string;
    GIT_IMG_SRC: string;
    LINKEDIN_IMG_SRC: string;
    GTRI_IMAGE_SRC: string;
    STACK_OVERFLOW_IMG_SRC: string;
    GOOGLE_IMG_SRC: string;
    RIT_IMG_SRC: string;
    TRELLO_IMG_SRC: string;

    QUCIK_LINKS_SECTION: string;

    BING_ALT: string;
    FIRST_ALT: string;
    GIT_ALT: string;
    LINKEDIN_ALT: string;
    GTRI_ALT: string;
    STACK_OVERFLOW_ALT: string;
    GOOGLE_ALT: string;
    RIT_ALT: string;
    TRELLO_ALT: string;

    BING_LINK: string;
    FIRST_LINK: string;
    GIT_LINK: string;
    LINKEDIN_LINK: string;
    GTRI_LINK: string;
    STACK_OVERFLOW_LINK: string;
    GOOGLE_LINK: string;
    RIT_LINK: string;
    TRELLO_LINK: string;

    // Personal Web App
    HOME_PAGE_ROUTE: string;
    ABOUT_PAGE_ROUTE: string;
    WEATHER_PAGE_ROUTE: string;
    ASTRONOMY_PAGE_ROUTE: string;

    GITHUB_PROJ_LINK: string;
    ATTRIBUTION: string;
}

export function loadAppConfig(): IAppConfig {
    console.log('Loaded the App Config.');
    return appConfig as IAppConfig;
}
