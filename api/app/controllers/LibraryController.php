<?php
header('Access-Control-Allow-Origin: *');

class LibraryController extends BaseController {






	//add sorting parameters to URL for artist, album, song, and genre
	public function getLibrary($id)
	{

		$library = Library::where('user_id', '=', $id)
							->where('is_deleted', '=', NULL)
							->join('library_songs', 'library.id', '=', 'library_songs.library_id')
							->join('songs', 'songs.id', '=', 'library_songs.song_id')
							->orderBy('library_songs.created_at', 'DESC')
							->get();


		// //Fetch library id based on user id
		// $libraryId = Library::where('user_id', '=', $id)
		// ->get();


		// $obj = array(
		// 	'library'=>$library,
		// 	'libraryId'=>$libraryId[0]->id);


		header('Access-Control-Allow-Origin: *');
		return Response::json($library);
	}












	//Add song to library
	public function addToLibrary($songId, $userId)
	{

		//Fetch library id based on user id
		$libraryId = Library::where('user_id', '=', $userId)
		->get();


		//Insert song id into user songs paired to library id
		$librarySongs = LibrarySongs::insert(array(
			'song_id'=>$songId,
			'library_id'=>$libraryId[0]->id));




		header('Access-Control-Allow-Origin: *');
		return Response::json($librarySongs);
	}











	//Remove song from library
	public function removeFromLibrary($songId, $userId)
	{

		//Fetch library id based on user id
		$libraryId = Library::where('user_id', '=', $userId)->get();


		//Mark as removed where song id & library id match
		$librarySongs = LibrarySongs::where('library_id', '=', $libraryId[0]->id)
									->where('song_id', '=', $songId)
									->update(array(
											'is_deleted'=>"true"
											));

		$obj = array('libid'=>$libraryId[0]->id,
				'songid'=>$songId);


		header('Access-Control-Allow-Origin: *');
		return Response::json($obj);
	}











	public function deleteLibrary()
	{
		return "Testing route";
	}









	//================//
	//Internal Methods//
	//================//

}