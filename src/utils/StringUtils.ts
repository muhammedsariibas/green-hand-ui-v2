export default {
    formatString(format: string, values: Record<string, any>): string {
        return format.replace(/{(\w+)}/g, (match, key) => {
            if (values.hasOwnProperty(key)) {
                return values[key].toString();
            }
            return match; // Leave the placeholder unchanged if the key is not found in values
        });
    },
    isNullOrEmpty(str:string|null|undefined){
        return typeof str === "undefined" || str == null || str.length === 0
    },
    isShorterThan(str:string|null|undefined,len:number){
        return this.isNullOrEmpty(str) || (str != undefined && str?.length < len);
    }
}