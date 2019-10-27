declare class RestForm {
    object: any;
    xhr: any;
    methods: any;
    isArray: any;
    url: any;
    constructor(object: any);
    save(data: any): void;
    update(data: any): void;
    get(callback: Function, user: string, password: string): void;
    getOne(descriptor: string): void;
}
