const handleClarifaiCall = (req, res) => {
    const setClarifaiRequestOptions = (imageUrl) => {
        const PAT = config.CLARIFAI_API_KEY;
        const USER_ID = config.CLARIFAI_API_USER;       
        const APP_ID = 'facerecog1';
        const IMAGE_URL = imageUrl;
      
        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });
      
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };
    
        return requestOptions;
    }
    const MODEL_ID = 'face-detection';
    const requestOptions = setClarifaiRequestOptions(req.body.image);


    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(data => res.json(data));
}

const handleImageCount = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(dbResponse => {
        if(dbResponse[0].entries > 0){
            res.json(dbResponse[0].entries);
        } else {
            res.status(400).json("no such user");
        }
    }).catch(error => {
        res.status(500).json(error);
    });
}

module.exports = {
    handleImageCount,
    handleClarifaiCall
};