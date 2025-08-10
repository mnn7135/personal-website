import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { SmallPaddingBar, ThinPaddingBar } from './padding-bar';

interface InfoListCardProps {
    cardTitle?: string;
    dataLabels?: string[];
    data: string[];
    center?: boolean;
    stretch?: boolean;
}

export default function InfoListCard(props: InfoListCardProps) {
    return (
        <Card
            className={`w-full ${props.stretch ? '' : 'max-w-md'}`}
            style={{ textAlign: props.center ? 'center' : 'left' }}
        >
            <CardHeader>
                {props.cardTitle ? (
                    <>
                        <CardTitle>
                            <div className="text-2xl">{props.cardTitle}</div>
                        </CardTitle>
                        <SmallPaddingBar></SmallPaddingBar>
                    </>
                ) : (
                    <></>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex" style={{ textAlign: props.center ? 'center' : 'left' }}>
                    <div className={`${props.dataLabels ? 'flex-5/12 flex-col' : ''}`}>
                        {props.dataLabels ? (
                            <>
                                {props.dataLabels.map((label, index) => {
                                    return (
                                        <div key={`info-card-${label}-${index}`}>
                                            {label}
                                            <ThinPaddingBar></ThinPaddingBar>
                                        </div>
                                    );
                                })}{' '}
                                <div className="flex-2/12"></div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                    <div
                        className={`${props.dataLabels ? 'flex-5/12 flex-col' : 'flex-12/12 flex-col'}`}
                    >
                        {props.data
                            ? props.data.map((dataElement, index) => {
                                  return (
                                      <div key={`info-card-data-${index}`}>
                                          {dataElement}
                                          <ThinPaddingBar></ThinPaddingBar>
                                      </div>
                                  );
                              })
                            : ''}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
    );
}
