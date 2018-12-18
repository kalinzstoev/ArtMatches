# artmatches
My dissertation project.
Please see ArtMatches - Overview and Development Process.pdf for full overview of the project.

1.To run the app follow instructions here to get meteor:
https://www.meteor.com/install
2.go to app folder
3. type in meteor, enter e.g. c:\artmatches\meteor

For images and audios to be stored and retrieved you need an S3 store. which then requires an update across audios.js, images.js and thumbnails.js for:
  accessKeyId: "",
    secretAccessKey: "",

never got to refactor this for to have in properties file or env variable so appologies for the mess :)

Have fun with the app!
