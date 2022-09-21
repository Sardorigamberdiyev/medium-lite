export default interface IModel<T> {
    save: () => Promise<T>;
}