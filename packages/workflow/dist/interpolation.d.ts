/**
 * resolveInputs takes an object of action inputs, and fully interpolates all
 * refs within the inputs using the given state and event.
 *
 * @param inputs an object of actio inputs
 * @param vars the variables used for interpolation, eg. { state: {...}, event: {...} }.
 * @returns an object with the resolved inputs fully interpolated
 */
export declare const resolveInputs: (inputs: Record<string, any>, vars: Record<string, any>) => Record<string, any>;
/**
 * refs returns a list of all refs found within the input, as an object
 * containing the path and the original ref.
 *
 * @param input any action input, eg. a string, object, or number,
 * @returns a list of all refs found.
 */
export declare function refs(input: any): Array<{
    path: string;
    ref: string;
}>;
/**
 * interpolate takes a single input and interpolates all refs within the input using
 * the given state and event.
 *
 * This handles non-ref values, single refs which return non-string values, string
 * interpolation, and object interpolation with a full depth-first traversal to interpoalte
 * all values within an object.
 *
 * @param value any action input, eg. a string, object, or number,
 * @param vars the variables used for interpolation, eg. { state: {...}, event: {...} }.
 * @returns the input with all refs interpolated
 */
export declare function interpolate(value: any, vars: Record<string, any>): any;
//# sourceMappingURL=interpolation.d.ts.map