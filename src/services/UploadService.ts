export class UploadService {
    public static uploadJson(onSuccess: (json: string) => void): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const contents = e.target.result;
                onSuccess(contents);
            };
            reader.readAsText(file);
        };

        input.click();
    }
}

