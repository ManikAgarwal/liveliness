document.getElementById('launchFaceCaptureScreen').addEventListener('click',function(e){

    e.preventDefault();    
            
console.log("start liveness");

var jwtToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjZhZjgyNSIsImhhc2giOiJjZmE2ZGFmZWZlMzNkMzViNjhjNzk4NDUzOWIwMzBiZTc0MTk2NGIxZTBjZGMyZjdkYmM5NzZlNDUwNzM3ODE1IiwiaWF0IjoxNjIwMzcxNjA5LCJleHAiOjE2MjAzODE2MDksImp0aSI6ImE3NmE1OTg4LTEwNGMtNGM3NC05ZjBmLWJhZTU3YTA2MjQ0OSJ9.np1lLg4rNEbMxduSkCWUobzDp2LYYp4Lr0cPEJeO0_iPSmiUoiBjeF9bhTxthPXRzklXVJy033jsaFE4zezkQ7Agoa7BE-WbGzchrIWulnJ7rlC7ABI-0Ejh2pfMnN7YnXPS4900eyffqOSpSRSAoLSxJptn5ihWEf7jrNRUctY";

//    Initialize the SDK only when someone clicks the button
HyperSnapSDK.init(jwtToken, HyperSnapParams.Region.AsiaPacific);
HyperSnapSDK.startUserSession(); 
//Here HyperVerge will set a transactionId.

// show face capture screen
     var hvFaceConfig = new HVFaceConfig();
     hvFaceConfig.setShouldShowInstructionPage(true);

     callback = (HVError, HVResponse) => {
       if(HVError) {
         var errorCode = HVError.getErrorCode();
         var errorMessage = HVError.getErrorMessage();
       } 
      if(HVResponse) {
         var apiResults = HVResponse.getApiResult();
         var apiHeaders = HVResponse.getApiHeaders();
        var imageBase64 = HVResponse.getImageBase64();
    var attemptsCount = HVResponse.getAttemptsCount();
    document.getElementById("faceCaptureResult").text(JSON.stringify(apiResults));
      }
    };

     HVFaceModule.start(hvFaceConfig, callback);
}
);
