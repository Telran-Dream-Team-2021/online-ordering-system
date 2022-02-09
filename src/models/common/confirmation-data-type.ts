export type ConfirmationDataType = {
    title: string,
    message: string,
    handler: (status: boolean) => void
};

export const initialConfirmationData: ConfirmationDataType = {
    title: '',
    message: '',
    handler: () => {}
}