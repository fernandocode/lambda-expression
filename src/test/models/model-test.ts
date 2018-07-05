import { ReferencesModelTest } from "./reference-model-test";

export class ModelTest {
    public id: number = 0;
    public name: string = "";
    public description: string = "";
    public date: Date = new Date();
    public isValid: boolean = false;
    public reference: ReferencesModelTest = new ReferencesModelTest();
}
