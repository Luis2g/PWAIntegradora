class Camera {
    constructor (videoNote){
        this.videoNote = videoNote;
    }

    power(){
        navigator.mediaDevices.getUserMedia(
            {
                audio : false,
                video: {
                    height: 300,
                    width : 300
                }
            }
        ).then( stream => {
             this.videoNote.srcObject = stream;
             this.stream = stream;
        } )
    }

    off(){
        this.videoNote.pause();
        if(this.stream){
            this.stream.getTracks()[0].stop();
        }
    }

    takePhoto(){
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);
        let context = canvas.getContext('2d');
        context.drawImage(this.videoNote, 0, 0, canvas.width, canvas.height);
        this.photo = context.canvas.toDataURL();
        canvas = null;
        context = null;
        return this.photo;
    }

}


