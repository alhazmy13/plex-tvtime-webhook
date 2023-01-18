import dayjs from 'dayjs';
import {config} from "./config";
import TvTimeApi from "./tvtime/api";
import express, {Request, Response} from 'express';
import multer from 'multer';

const app = express();
const bodyMulter = multer();

const port = config.port;
const host = config.host;

app.post('/tvtime', bodyMulter.any(),  async (req: Request, res: Response) => {
  const body = JSON.parse(req.body.payload);
  const plexUser = req.query.user;
  if (!plexUser) {
    return res.status(400).send({'message': 'PlexUserMissing'});
	}
  print(`Event : ${body.event}`);
	if (body.event != "media.scrobble") {
    return res.status(400).send({'message': 'BadEvent'});
	}

	print(`Account : ${body.Account.title}`)
  if (body.Account.title != plexUser) {
		return  res.status(400).send({'message': 'BadUser'});
	}

  print(`Content type : ${body.Metadata.type}`)
	if (body.Metadata.type != "episode") {
    return  res.status(400).send({'message': 'BadType'});
	}

  const episodeId = parseGuid(body.Metadata.Guid);
  print(`Episode Id : ${episodeId}`)

  if(!await TvTimeApi.markAsWatched(episodeId)){
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
