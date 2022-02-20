import {Observable} from "rxjs";

export default interface DataProvider<T> {
    /**
     * Adds new entity into database
     * @param entity
     */
    add(entity: T): Promise<T>;

    /**
     * Removes entity from database
     * @param id
     */
    remove(id: number | string): Promise<T>;

    /**
     * Checks that the entity with given id is exists in database
     * @param id
     */
    exists(id: number | string): Promise<boolean>;

    /**
     * Returns entity with given id if its defined, otherwise all entities using observing
     * @param id
     */
    get(id?: number | string): Observable<T[]> | Promise<T>;

    /**
     * Replaces entity, with given id, with the newEntity
     * @param id
     * @param newEntity
     * @return Old entity
     */
    update(id: number | string, newEntity: T): Promise<T>;

    /**
     * Return observable of first entity with given id
     * @param id
     */
    getFirst(id: number | string): Observable<T>;
}