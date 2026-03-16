import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { SmallPaddingBar, ThinPaddingBar } from './padding-bar';

interface InfoListCardProps {
    cardTitle?: string;
    dataLabels?: string[];
    scaleDataText?: boolean;
    data: string[];
    center?: boolean;
    stretch?: boolean;
    alllowLastLineBar?: boolean;
}

export default function InfoListCard(props: InfoListCardProps) {
    return (
        <Card
            className={`w-full ${props.stretch ? '' : 'max-w-md'}`}
            style={{ textAlign: props.center ? 'center' : 'left' }}
        >
            <CardContent>
                <div className="text-xl font-bold">{props.cardTitle ?? props.cardTitle}</div>
                <div className="flex" style={{ textAlign: props.center ? 'center' : 'left' }}>
                    <div className={`${props.dataLabels ? 'flex-5/12 flex-col' : ''}`}>
                        {props.dataLabels ? (
                            <>
                                {props.dataLabels.map((label, index) => {
                                    return (
                                        <div key={`info-card-${label}-${index}`}>
                                            <div className="p-1 font-bold">{label}</div>
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
                                          <div
                                              className={
                                                  props.scaleDataText
                                                      ? 'p-1 text-2xl font-extrabold'
                                                      : 'p-1'
                                              }
                                          >
                                              {dataElement}
                                          </div>
                                          {props.data.length - 1 == index &&
                                          !props.alllowLastLineBar ? (
                                              <></>
                                          ) : (
                                              <ThinPaddingBar></ThinPaddingBar>
                                          )}
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
