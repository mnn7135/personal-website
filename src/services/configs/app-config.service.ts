import appConfig from './json/app-config.json';

export interface IAppConfig {
    /** Developer Photo */
    PERSONAL_IMG_SRC: string;
    PERSONAL_IMG_ALT: string;

    /** Weather Page */
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
    HISTORICAL_DATA_SECTION: string;
    LAST_PULL_FROM: string;
    LAST_MAINTENANCE: string;
    WEATHER_STATION_DISCLAIMER: string;

    /** Tools Page */
    TOOLS_TITLE: string;
    TOOLS_SUBMIT_BUTTON_TEXT: string;
    TOOLS_ALERT_TEXT: string;

    /** Home Page */
    HOME_TITLE: string;
    HOME_TITLE_TOP: string;
    HOME_TITLE_MID: string;
    HOME_TITLE_BTM: string;
    HOME_TEXT_ONE: string;
    HOME_TEXT_TWO: string;

    /** About Page */
    ABOUT_TITLE: string;
    ABOUT_TEXT_ONE: string;
    ABOUT_TEXT_TWO: string;

    /** About Page */
    CONTACT_TITLE: string;
    CONTACT_TEXT: string;
    CONTACT_TITLE_SUBMIT_STATION: string;
    CONTACT_TEXT_SUBMIT_STATION: string;
    CONTACT_SUBMIT_BUTTON_TEXT: string;

    /** Radar Page */
    RADAR_TITLE: string;

    /** Graphs Page */
    WEATHER_GRAPHS_TITLE: string;
    WEATHER_GRAPHS_LOCATION_TEXT: string;
    WEATHER_GRAPHS_LOCATION: string;

    /** Placeholder Text */
    LOREM_IPSUM: string;

    /** Routes */
    HOME_PAGE_ROUTE: string;
    ABOUT_PAGE_ROUTE: string;
    WEATHER_PAGE_ROUTE: string;
    ASTRONOMY_PAGE_ROUTE: string;
    SOFTWARE_PAGE_ROUTE: string;

    /** Footer */
    GITHUB_PROJ_LINK: string;
    ATTRIBUTION: string;
}

export function loadAppConfig(): IAppConfig {
    return appConfig as IAppConfig;
}
