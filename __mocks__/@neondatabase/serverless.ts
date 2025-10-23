// Mocks the @neondatabase/serverless module
const noOp = () => {};

export function neon() {
    return () => {
        return { response: [{}] };
    };
}
