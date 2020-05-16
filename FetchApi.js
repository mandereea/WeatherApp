class FetchApi{
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    async getApiResponse(lat, lon){
        const responseServer = await fetch(`${this.baseUrl}lat=${lat}&lon=${lon}&appid=40548cc5b12a46ee9418e263dd707583`);
        const response = responseServer.json();
        //console.log(response);
        return response;
    }
}