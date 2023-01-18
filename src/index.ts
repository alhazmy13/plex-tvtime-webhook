import dayjs from 'dayjs';
import {config} from "./config";
import TvTimeApi from "./tvtime/api";
import bodyParser from "body-parser";
import express, {Request, Response} from 'express';

const app = express();
const jsonParser = bodyParser.json()
const port = config.port;
const host = config.host;


app.post('/tvtime', jsonParser,  async (req: Request, res: Response) => {

  const plexUser = req.params.user;
  if (!plexUser) {
    return res.status(400).send({'message': 'PlexUserMissing'});
	}
  print(`Event : ${req.body.event}`);
	if (req.body.event != "media.scrobble") {
    return res.status(400).send({'message': 'BadEvent'});
	}

	print(`Account : ${req.body.Account.title}`)
  if (req.body.Account.title != plexUser) {
		return  res.status(400).send({'message': 'BadUser'});
	}

  print(`Content type : ${req.body.Metadata.type}`)
	if (req.body.Metadata.type != "episode") {
    return  res.status(400).send({'message': 'BadType'});
	}

  const episodeId = parseGuid(req.body.Metadata.Guid);
  print(`Episode Id : ${episodeId}`)

  if(await TvTimeApi.markAsWatched(episodeId) === null){
    print(`Error happend with Episode Id : ${episodeId}`)
    return  res.status(400).send({'message': 'Episode Id : ' + episodeId + ' marked as watched'});    
  }
  
  print(`Episode Id : ${episodeId} marked as watched`)
  return  res.status(200).send({'message': 'Episode Id : ' + episodeId + ' marked as watched'});  

});

function parseGuid(guid: any[]){
  const tvdb = guid.filter(item =>  item.id.startsWith('tvdb'));
  if(tvdb.length == 0){
    return null;
  }
  return tvdb[0].id.replace('tvdb://','');
}


function print(message: string) {
  console.log("[" + dayjs(Date.now()).format("HH:mm:ss") + "]", message);
}

app.listen(port, host , () =>{
  print(`App listening on ${host}:${port}`)

});
