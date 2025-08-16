import { JSX } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { SmallPaddingBar } from './padding-bar';

interface InfoCardProps {
    cardTitle?: string;
    cardDescription?: string;
    secondaryTitle?: string;
    ternaryTitle?: string;
    description?: string;
    center?: boolean;
    stretch?: boolean;
    scaleTitle?: boolean;
    overhead?: string;
    scaleDescription?: boolean;
    icon?: JSX.Element;
    children?: JSX.Element;
}

export default function InfoCard(props: InfoCardProps) {
    return (
        <Card
            className={`w-full ${props.stretch ? '' : 'max-w-md'}`}
            style={{ textAlign: props.center ? 'center' : 'left' }}
        >
            <CardHeader>
                {props.overhead ? (
                    <>
                        <CardTitle>
                            <div className={'text-4xl'}>{props.overhead}</div>
                        </CardTitle>
                        <SmallPaddingBar></SmallPaddingBar>
                    </>
                ) : (
                    <></>
                )}
                {props.cardTitle ? (
                    <>
                        <CardTitle>
                            <div className={props.scaleTitle ? 'text-8xl' : 'text-2xl'}>
                                {props.cardTitle}
                            </div>
                        </CardTitle>
                        <SmallPaddingBar></SmallPaddingBar>
                    </>
                ) : (
                    <></>
                )}
                {props.ternaryTitle ? (
                    <>
                        <CardTitle>
                            <div className="text-lg">{props.ternaryTitle}</div>
                        </CardTitle>
                    </>
                ) : (
                    ''
                )}
                {props.secondaryTitle ? (
                    <>
                        <CardTitle className={props.scaleTitle ? 'text-2xl' : ''}>
                            {props.secondaryTitle}
                        </CardTitle>
                    </>
                ) : (
                    ''
                )}
            </CardHeader>
            {props.children || props.cardDescription ? (
                <CardContent>
                    {props.icon ? (
                        <>
                            <CardDescription className="flex-flow flex place-content-around">
                                {props.icon ?? <></>}
                            </CardDescription>
                        </>
                    ) : (
                        <></>
                    )}
                    {props.cardDescription ? (
                        <>
                            <CardDescription
                                className={`${props.scaleDescription ? 'text-2xl' : ''}`}
                            >
                                {props.cardDescription}
                            </CardDescription>
                            {props.children ? <br></br> : ''}
                        </>
                    ) : (
                        <></>
                    )}
                    {props.children ? <>{props.children}</> : ''}
                </CardContent>
            ) : (
                <></>
            )}
            <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
    );
}
