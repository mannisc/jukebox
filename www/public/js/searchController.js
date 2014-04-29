/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */





var searchController = function () {

};

searchController.maxResults = 100;


searchController.searchSongsString = "";

searchController.searchResults = [];

searchController.searchResultsComplete = [];

searchController.searchCounter = 0;

searchController.buttonActive = 0;

searchController.maxPopularSongPages = 2;
searchController.maxArtistSongPages = 2;
searchController.serverSearch = false;

//Template--------------------------START
searchController.preloadedPopularSongs = {"tracks":{"track":[{"name":"Happy","duration":"232","playcount":"110536","listeners":"51531","mbid":"a53f401a-f35c-4215-821b-c7fb0af1664d","url":"http:\/\/www.last.fm\/music\/Pharrell+Williams\/_\/Happy","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Pharrell Williams","mbid":"149f91ef-1287-46da-9a8e-87fee02f1471","url":"http:\/\/www.last.fm\/music\/Pharrell+Williams"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92659171.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92659171.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92659171.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92659171.png","size":"extralarge"}]},{"name":"Do I Wanna Know?","duration":"358","playcount":"78875","listeners":"39056","mbid":"575d24ee-cf80-48ad-beeb-9295c7d05b35","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys\/_\/Do+I+Wanna+Know%3F","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Arctic Monkeys","mbid":"ada7a83c-e3e1-40f1-93f9-3e73dbc9298a","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92744747.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92744747.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92744747.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92744747.png","size":"extralarge"}]},{"name":"Royals","duration":"190","playcount":"76029","listeners":"38450","mbid":"e34f19b4-abe0-4781-8fe5-b206aa6fd5fe","url":"http:\/\/www.last.fm\/music\/Lorde\/_\/Royals","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lorde","mbid":"14cd21f6-df8e-4bff-af75-0dcfeb307c5d","url":"http:\/\/www.last.fm\/music\/Lorde"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93158109.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93158109.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93158109.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93158109.png","size":"extralarge"}]},{"name":"Magic","duration":"201","playcount":"82365","listeners":"36727","mbid":"5eaee471-7c3e-49ef-9dba-2f09b2d41fd3","url":"http:\/\/www.last.fm\/music\/Coldplay\/_\/Magic","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Coldplay","mbid":"cc197bad-dc9c-440d-a5b5-d52ba2e14234","url":"http:\/\/www.last.fm\/music\/Coldplay"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/97289583.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/97289583.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/97289583.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/97289583.png","size":"extralarge"}]},{"name":"West Coast","duration":"257","playcount":"409035","listeners":"36258","mbid":"","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/West+Coast","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/98170979.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/98170979.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/98170979.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/98170979.png","size":"extralarge"}]},{"name":"Team","duration":"193","playcount":"79597","listeners":"35998","mbid":"542ab93f-96e8-429e-9b30-0734c0a08560","url":"http:\/\/www.last.fm\/music\/Lorde\/_\/Team","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lorde","mbid":"14cd21f6-df8e-4bff-af75-0dcfeb307c5d","url":"http:\/\/www.last.fm\/music\/Lorde"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93158109.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93158109.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93158109.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93158109.png","size":"extralarge"}]},{"name":"Radioactive","duration":"276","playcount":"65604","listeners":"33654","mbid":"30b4194d-e9b9-42b1-aee6-80d24dc4c6a7","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons\/_\/Radioactive","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Imagine Dragons","mbid":"012151a8-0f9a-44c9-997f-ebd68b5389f9","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87897873.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87897873.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87897873.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87897873.png","size":"extralarge"}]},{"name":"Rather Be (feat. Jess Glynne)","duration":"230","playcount":"71904","listeners":"32531","mbid":"b943a543-d5f3-4cda-8be7-1765dfbddc55","url":"http:\/\/www.last.fm\/music\/Clean+Bandit\/_\/Rather+Be+(feat.+Jess+Glynne)","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Clean Bandit","mbid":"dacc2d64-7e59-42a8-87a9-10c53919aff2","url":"http:\/\/www.last.fm\/music\/Clean+Bandit"},"image":[{"#text":"http:\/\/cdn.last.fm\/flatness\/catalogue\/noimage\/2\/default_album_medium.png","size":"small"},{"#text":"http:\/\/cdn.last.fm\/flatness\/catalogue\/noimage\/2\/default_album_medium.png","size":"medium"},{"#text":"http:\/\/cdn.last.fm\/flatness\/catalogue\/noimage\/2\/default_album_medium.png","size":"large"},{"#text":"http:\/\/cdn.last.fm\/flatness\/catalogue\/noimage\/2\/default_album_medium.png","size":"extralarge"}]},{"name":"Pompeii","duration":"214","playcount":"60534","listeners":"32020","mbid":"9833ffbd-a387-415f-baab-dedd322529a9","url":"http:\/\/www.last.fm\/music\/Bastille\/_\/Pompeii","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Bastille","mbid":"16c07e8e-e1ef-452c-bbb7-0cda599c1ffd","url":"http:\/\/www.last.fm\/music\/Bastille"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/91244823.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/91244823.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/91244823.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/91244823.png","size":"extralarge"}]},{"name":"Demons","duration":"174","playcount":"65313","listeners":"31889","mbid":"96eaa695-3a59-401d-9501-74648b815df0","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons\/_\/Demons","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Imagine Dragons","mbid":"012151a8-0f9a-44c9-997f-ebd68b5389f9","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87897873.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87897873.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87897873.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87897873.png","size":"extralarge"}]},{"name":"Counting Stars","duration":"258","playcount":"61793","listeners":"30415","mbid":"06a8cf10-7709-4845-bc67-449a073abeeb","url":"http:\/\/www.last.fm\/music\/OneRepublic\/_\/Counting+Stars","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"OneRepublic","mbid":"8aafd46e-f5d3-4923-8da1-43c0a296947f","url":"http:\/\/www.last.fm\/music\/OneRepublic"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87338269.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87338269.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87338269.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87338269.png","size":"extralarge"}]},{"name":"Dark Horse","duration":"216","playcount":"58286","listeners":"28300","mbid":"0971edd0-15f1-420d-8701-e17957707dbf","url":"http:\/\/www.last.fm\/music\/Katy+Perry\/_\/Dark+Horse","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Katy Perry","mbid":"122d63fc-8671-43e4-9752-34e846d62a9c","url":"http:\/\/www.last.fm\/music\/Katy+Perry"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/98230957.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/98230957.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/98230957.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/98230957.png","size":"extralarge"}]},{"name":"R U Mine?","duration":"200","playcount":"53162","listeners":"26185","mbid":"64745b72-5bc8-43a9-a2a3-0d20afd42d5d","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys\/_\/R+U+Mine%3F","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Arctic Monkeys","mbid":"ada7a83c-e3e1-40f1-93f9-3e73dbc9298a","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92744747.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92744747.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92744747.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92744747.png","size":"extralarge"}]},{"name":"All of Me","duration":"269","playcount":"54293","listeners":"25412","mbid":"0bdd647a-3b97-433a-be98-065c4678c6df","url":"http:\/\/www.last.fm\/music\/John+Legend\/_\/All+of+Me","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"John Legend","mbid":"75a72702-a5ef-4513-bca5-c5b944903546","url":"http:\/\/www.last.fm\/music\/John+Legend"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/91458889.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/91458889.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/91458889.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/91458889.png","size":"extralarge"}]},{"name":"Burn","duration":"231","playcount":"45691","listeners":"23758","mbid":"b9548807-0676-46cb-a147-c2b435f39b1b","url":"http:\/\/www.last.fm\/music\/Ellie+Goulding\/_\/Burn","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Ellie Goulding","mbid":"33ca19f4-18c8-4411-98df-ac23890ce9f5","url":"http:\/\/www.last.fm\/music\/Ellie+Goulding"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/91777855.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/91777855.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/91777855.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/91777855.png","size":"extralarge"}]},{"name":"Wake Me Up","duration":"255","playcount":"40181","listeners":"23348","mbid":"172f98e7-3ce3-4005-bec4-36ae112c9b7e","url":"http:\/\/www.last.fm\/music\/Avicii\/_\/Wake+Me+Up","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Avicii","mbid":"24b930c0-5f27-4723-a5aa-3b8b830fb914","url":"http:\/\/www.last.fm\/music\/Avicii"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93069463.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93069463.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93069463.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93069463.png","size":"extralarge"}]},{"name":"Safe and Sound","duration":"193","playcount":"40413","listeners":"22467","mbid":"be7b5d59-e5d4-440e-b421-8c4006c5a5ce","url":"http:\/\/www.last.fm\/music\/Capital+Cities\/_\/Safe+and+Sound","streamable":{"#text":"1","fulltrack":"0"},"artist":{"name":"Capital Cities","mbid":"119a2c67-e6d6-41cf-a58c-c51b75c80daa","url":"http:\/\/www.last.fm\/music\/Capital+Cities"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/90200311.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/90200311.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/90200311.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/90200311.png","size":"extralarge"}]},{"name":"The Man","duration":"255","playcount":"44675","listeners":"22323","mbid":"1c85a3c9-5566-42d7-bb06-5814dd6a569f","url":"http:\/\/www.last.fm\/music\/Aloe+Blacc\/_\/The+Man","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Aloe Blacc","mbid":"4bf89e02-6c30-4603-9f6a-52619b1bea1a","url":"http:\/\/www.last.fm\/music\/Aloe+Blacc"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/94175335.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/94175335.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/94175335.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/94175335.png","size":"extralarge"}]},{"name":"Let Her Go","duration":"249","playcount":"40752","listeners":"22232","mbid":"1682cf55-a9a6-429c-a7f0-ff756781570a","url":"http:\/\/www.last.fm\/music\/Passenger\/_\/Let+Her+Go","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Passenger","mbid":"186e216a-2f8a-41a1-935f-8e30c018a8fe","url":"http:\/\/www.last.fm\/music\/Passenger"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87731471.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87731471.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87731471.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87731471.png","size":"extralarge"}]},{"name":"Hey Brother","duration":"255","playcount":"39995","listeners":"21459","mbid":"7cd3d674-0988-49a0-ab87-b5445c2348c0","url":"http:\/\/www.last.fm\/music\/Avicii\/_\/Hey+Brother","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Avicii","mbid":"24b930c0-5f27-4723-a5aa-3b8b830fb914","url":"http:\/\/www.last.fm\/music\/Avicii"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93069463.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93069463.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93069463.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93069463.png","size":"extralarge"}]},{"name":"Why'd You Only Call Me When You're High?","duration":"161","playcount":"41805","listeners":"20989","mbid":"","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys\/_\/Why%27d+You+Only+Call+Me+When+You%27re+High%3F","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Arctic Monkeys","mbid":"ada7a83c-e3e1-40f1-93f9-3e73dbc9298a","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92743903.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92743903.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92743903.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92743903.png","size":"extralarge"}]},{"name":"Timber","duration":"200","playcount":"37191","listeners":"20666","mbid":"","url":"http:\/\/www.last.fm\/music\/Pitbull\/_\/Timber","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Pitbull","mbid":"3f7b5e3e-289a-44d7-95a7-f7ffab7a2bf2","url":"http:\/\/www.last.fm\/music\/Pitbull"}},{"name":"Summertime Sadness","duration":"266","playcount":"38858","listeners":"20356","mbid":"2c1a7857-4d9d-4c08-b036-240218fe2518","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/Summertime+Sadness","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/88340753.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/88340753.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/88340753.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/88340753.png","size":"extralarge"}]},{"name":"Arabella","duration":"207","playcount":"38233","listeners":"20112","mbid":"f7ea0f9e-18dc-4bf8-8c19-9d4ab3b01293","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys\/_\/Arabella","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Arctic Monkeys","mbid":"ada7a83c-e3e1-40f1-93f9-3e73dbc9298a","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92744747.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92744747.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92744747.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92744747.png","size":"extralarge"}]},{"name":"Tennis Court","duration":"199","playcount":"43192","listeners":"20001","mbid":"3b083303-7c3e-4bf3-8457-6eb417f581f5","url":"http:\/\/www.last.fm\/music\/Lorde\/_\/Tennis+Court","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lorde","mbid":"14cd21f6-df8e-4bff-af75-0dcfeb307c5d","url":"http:\/\/www.last.fm\/music\/Lorde"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93158109.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93158109.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93158109.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93158109.png","size":"extralarge"}]},{"name":"Let It Go","duration":"224","playcount":"49048","listeners":"19694","mbid":"","url":"http:\/\/www.last.fm\/music\/Idina+Menzel\/_\/Let+It+Go","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Idina Menzel","mbid":"929ca8c3-5df3-4fe9-bc59-f8d603780bce","url":"http:\/\/www.last.fm\/music\/Idina+Menzel"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/95216809.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/95216809.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/95216809.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/95216809.png","size":"extralarge"}]},{"name":"Addicted to You","duration":"148","playcount":"39601","listeners":"18902","mbid":"6010dc82-16f2-434b-80bd-9ed2048dcab9","url":"http:\/\/www.last.fm\/music\/Avicii\/_\/Addicted+to+You","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Avicii","mbid":"24b930c0-5f27-4723-a5aa-3b8b830fb914","url":"http:\/\/www.last.fm\/music\/Avicii"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/93069463.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/93069463.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/93069463.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/93069463.png","size":"extralarge"}]},{"name":"Born to Die","duration":"286","playcount":"35713","listeners":"18879","mbid":"ce64248a-5077-49dc-bc5f-520086dae011","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/Born+to+Die","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/88340753.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/88340753.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/88340753.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/88340753.png","size":"extralarge"}]},{"name":"Sail","duration":"259","playcount":"31605","listeners":"18723","mbid":"70e5e5fd-fb5d-498e-8e8b-7a24bfda9de2","url":"http:\/\/www.last.fm\/music\/AWOLNATION\/_\/Sail","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"AWOLNATION","mbid":"77b29df2-056e-409e-a1b2-5e2bbfe421c4","url":"http:\/\/www.last.fm\/music\/AWOLNATION"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/68205008.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/68205008.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/68205008.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/68205008.png","size":"extralarge"}]},{"name":"Summer","duration":"224","playcount":"44742","listeners":"18666","mbid":"","url":"http:\/\/www.last.fm\/music\/Calvin+Harris\/_\/Summer","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Calvin Harris","mbid":"8dd98bdc-80ec-4e93-8509-2f46bafc09a7","url":"http:\/\/www.last.fm\/music\/Calvin+Harris"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/97561221.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/97561221.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/97561221.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/97561221.png","size":"extralarge"}]},{"name":"Riptide","duration":"203","playcount":"37139","listeners":"18662","mbid":"97c05d07-00d6-4d55-bbb8-b14321d2e4d4","url":"http:\/\/www.last.fm\/music\/Vance+Joy\/_\/Riptide","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Vance Joy","mbid":"df36f6db-5987-46ed-9d02-0cf36ed4e060","url":"http:\/\/www.last.fm\/music\/Vance+Joy"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/94165023.jpg","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/94165023.jpg","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/94165023.jpg","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/94165023.jpg","size":"extralarge"}]},{"name":"On Top of the World","duration":"190","playcount":"33060","listeners":"18631","mbid":"0a702bb5-a98b-46d0-9b14-7969f4b9a444","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons\/_\/On+Top+of+the+World","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Imagine Dragons","mbid":"012151a8-0f9a-44c9-997f-ebd68b5389f9","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87897873.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87897873.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87897873.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87897873.png","size":"extralarge"}]},{"name":"I See Fire","duration":"301","playcount":"44417","listeners":"18551","mbid":"7d3253d7-c3ad-4c37-8318-6d3e9788e91e","url":"http:\/\/www.last.fm\/music\/Ed+Sheeran\/_\/I+See+Fire","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Ed Sheeran","mbid":"3bca1168-e7c6-4beb-9af9-db9dc674b1fa","url":"http:\/\/www.last.fm\/music\/Ed+Sheeran"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/95226015.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/95226015.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/95226015.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/95226015.png","size":"extralarge"}]},{"name":"Little Talks","duration":"267","playcount":"28605","listeners":"18027","mbid":"17ab8e49-5e69-4404-bfc9-549d3605c2eb","url":"http:\/\/www.last.fm\/music\/Of+Monsters+and+Men\/_\/Little+Talks","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Of Monsters and Men","mbid":"9e103f85-7af7-41d7-b83b-49ba8f0c5abf","url":"http:\/\/www.last.fm\/music\/Of+Monsters+and+Men"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/84421449.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/84421449.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/84421449.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/84421449.png","size":"extralarge"}]},{"name":"The Mother We Share","duration":"191","playcount":"33389","listeners":"18114","mbid":"a26239b3-d900-43d3-ad38-450e3bbf1f09","url":"http:\/\/www.last.fm\/music\/CHVRCHES\/_\/The+Mother+We+Share","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"CHVRCHES","mbid":"6a93afbb-257f-4166-b389-9f2a1e5c5df8","url":"http:\/\/www.last.fm\/music\/CHVRCHES"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92085853.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92085853.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92085853.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92085853.png","size":"extralarge"}]},{"name":"Get Lucky (feat. Pharrell Williams)","duration":"102","playcount":"29501","listeners":"18060","mbid":"","url":"http:\/\/www.last.fm\/music\/Daft+Punk\/_\/Get+Lucky+(feat.+Pharrell+Williams)","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Daft Punk","mbid":"056e4f3e-d505-4dad-8ec1-d04f521cbb56","url":"http:\/\/www.last.fm\/music\/Daft+Punk"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92459761.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92459761.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92459761.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92459761.png","size":"extralarge"}]},{"name":"Money on My Mind","duration":"194","playcount":"37092","listeners":"18039","mbid":"c48b7441-b68b-41e2-b5ca-300845ff0ec4","url":"http:\/\/www.last.fm\/music\/Sam+Smith\/_\/Money+on+My+Mind","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Sam Smith","mbid":"5a85c140-dcf9-4dd2-b2c8-aff0471549f3","url":"http:\/\/www.last.fm\/music\/Sam+Smith"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/97604427.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/97604427.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/97604427.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/97604427.png","size":"extralarge"}]},{"name":"Roar","duration":"223","playcount":"32532","listeners":"17990","mbid":"830bd7d7-be87-4c8c-8457-0424b86baf98","url":"http:\/\/www.last.fm\/music\/Katy+Perry\/_\/Roar","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Katy Perry","mbid":"122d63fc-8671-43e4-9752-34e846d62a9c","url":"http:\/\/www.last.fm\/music\/Katy+Perry"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/98230957.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/98230957.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/98230957.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/98230957.png","size":"extralarge"}]},{"name":"Smells Like Teen Spirit","duration":"300","playcount":"27092","listeners":"17964","mbid":"2a8b23eb-b94e-4801-9880-baa33458355d","url":"http:\/\/www.last.fm\/music\/Nirvana\/_\/Smells+Like+Teen+Spirit","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Nirvana","mbid":"5b11f4ce-a62d-471e-81fc-a69a8278c7da","url":"http:\/\/www.last.fm\/music\/Nirvana"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/83456717.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/83456717.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/83456717.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/83456717.png","size":"extralarge"}]},{"name":"#SELFIE","duration":"184","playcount":"35677","listeners":"17913","mbid":"aa718e39-8ce6-4a48-a6e3-f25818d15628","url":"http:\/\/www.last.fm\/music\/The+Chainsmokers\/_\/%23SELFIE","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"The Chainsmokers","mbid":"91a81925-92f9-4fc9-b897-93cf01226282","url":"http:\/\/www.last.fm\/music\/The+Chainsmokers"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/98135107.jpg","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/98135107.jpg","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/98135107.jpg","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/98135107.jpg","size":"extralarge"}]},{"name":"Sweater Weather","duration":"239","playcount":"34984","listeners":"17400","mbid":"c9396769-5949-4cda-88a7-c9e7bb662bfe","url":"http:\/\/www.last.fm\/music\/The+Neighbourhood\/_\/Sweater+Weather","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"The Neighbourhood","mbid":"53b06622-ec51-4924-a554-58b0affde6b5","url":"http:\/\/www.last.fm\/music\/The+Neighbourhood"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/84218865.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/84218865.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/84218865.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/84218865.png","size":"extralarge"}]},{"name":"Video Games","duration":"282","playcount":"31090","listeners":"17299","mbid":"519e24d9-bfe8-4d3b-bfb9-dc89a7064b1f","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/Video+Games","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/88340753.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/88340753.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/88340753.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/88340753.png","size":"extralarge"}]},{"name":"Intro","duration":"125","playcount":"29875","listeners":"17140","mbid":"48e5992d-ada5-4377-a4b4-eb813956f407","url":"http:\/\/www.last.fm\/music\/The+xx\/_\/Intro","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"The xx","mbid":"c5c2ea1c-4bde-4f4d-bd0b-47b200bf99d6","url":"http:\/\/www.last.fm\/music\/The+xx"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/88381869.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/88381869.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/88381869.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/88381869.png","size":"extralarge"}]},{"name":"Pumped Up Kicks","duration":"236","playcount":"26677","listeners":"16778","mbid":"ff6f37e5-c420-4acc-b3e4-5ecf1d78cbc7","url":"http:\/\/www.last.fm\/music\/Foster+the+People\/_\/Pumped+Up+Kicks","streamable":{"#text":"1","fulltrack":"1"},"artist":{"name":"Foster the People","mbid":"e0e1a584-dd0a-4bd1-88d1-c4c62895039d","url":"http:\/\/www.last.fm\/music\/Foster+the+People"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/62306479.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/62306479.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/62306479.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/62306479.png","size":"extralarge"}]},{"name":"Blue Jeans","duration":"209","playcount":"32519","listeners":"16810","mbid":"850e0d03-41bf-4d80-bafd-533d589f4c08","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/Blue+Jeans","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/88340753.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/88340753.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/88340753.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/88340753.png","size":"extralarge"}]},{"name":"One for the Road","duration":"206","playcount":"31297","listeners":"16701","mbid":"42f81b9d-4b96-4480-ab22-31ab3d602d42","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys\/_\/One+for+the+Road","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Arctic Monkeys","mbid":"ada7a83c-e3e1-40f1-93f9-3e73dbc9298a","url":"http:\/\/www.last.fm\/music\/Arctic+Monkeys"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92744747.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92744747.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92744747.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92744747.png","size":"extralarge"}]},{"name":"Best Day of My Life","duration":"194","playcount":"30666","listeners":"16400","mbid":"4918eef5-d5a5-4965-88ac-b6f750c966df","url":"http:\/\/www.last.fm\/music\/American+Authors\/_\/Best+Day+of+My+Life","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"American Authors","mbid":"9ce0515d-cc88-4df6-8a2e-d231c13cb2c2","url":"http:\/\/www.last.fm\/music\/American+Authors"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/92978887.jpg","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/92978887.jpg","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/92978887.jpg","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/92978887.jpg","size":"extralarge"}]},{"name":"Young and Beautiful","duration":"236","playcount":"32180","listeners":"16407","mbid":"ec197c76-c658-4412-a9ed-353387e5d0f7","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey\/_\/Young+and+Beautiful","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Lana Del Rey","mbid":"b7539c32-53e7-4908-bda3-81449c367da6","url":"http:\/\/www.last.fm\/music\/Lana+Del+Rey"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/96473271.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/96473271.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/96473271.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/96473271.png","size":"extralarge"}]},{"name":"Midnight City","duration":"244","playcount":"26010","listeners":"16024","mbid":"43da2a39-725d-4ada-9a11-a4cf3bd923fb","url":"http:\/\/www.last.fm\/music\/M83\/_\/Midnight+City","streamable":{"#text":"1","fulltrack":"0"},"artist":{"name":"M83","mbid":"6d7b7cd4-254b-4c25-83f6-dd20f98ceacd","url":"http:\/\/www.last.fm\/music\/M83"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/71737222.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/71737222.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/71737222.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/71737222.png","size":"extralarge"}]},{"name":"It's Time","duration":"238","playcount":"30729","listeners":"16006","mbid":"de786838-8acf-4a54-9c69-5f88aedca85d","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons\/_\/It%27s+Time","streamable":{"#text":"0","fulltrack":"0"},"artist":{"name":"Imagine Dragons","mbid":"012151a8-0f9a-44c9-997f-ebd68b5389f9","url":"http:\/\/www.last.fm\/music\/Imagine+Dragons"},"image":[{"#text":"http:\/\/userserve-ak.last.fm\/serve\/34s\/87897873.png","size":"small"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/64s\/87897873.png","size":"medium"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/126\/87897873.png","size":"large"},{"#text":"http:\/\/userserve-ak.last.fm\/serve\/300x300\/87897873.png","size":"extralarge"}]}],"@attr":{"page":"1","perPage":"50","totalPages":"20","total":"1000"}}}
;//TODO Change to  null;
//TS_INSERT:PreloadedPopularSongs
searchController.preloadedPopularSongs = searchController.preloadedPopularSongs.tracks;
//Template--------------------------END

searchController.init = function () {


    uiController.searchListScroll = new IScroll('#searchlist', {
        interactiveScrollbars: true,
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true,
        HWCompositing:false

    });

    // uiController.searchListScroll.on("scrollStart",function(){
    //})


    $("#searchinput").on("input", function () {
        $("#playlistInner .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollPlayIndicator").hide();
        switch (searchController.buttonActive) {
            case 0:
                searchController.searchMusic();
                break;
            case 1:
                searchController.filterMusic();
                break;
            case 2:
                searchController.filterMusic();
                break;
        }

    })

    for (var i = 0; i < 4; i++) {
        // searchController.searchButtons[i] =   $("#searchbutton"+(i+1)).parent().clone(true,true);
        console.log($("#searchbutton" + (i + 1)).parent().length)
    }

    searchController.activateButton(0, true);
    if (!urlParams.search || urlParams.search == "") {
        searchController.showPopulars();
    }


}


searchController.activateButton = function (index, noAnimation) {
    if (searchController.buttonActive == 0) {
        searchController.searchSongsString = $("#searchinput").val();
    }
    searchController.buttonActive = index;
    searchController.emptySearchList(true);

    $("#playlistInner .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();


    var input = $("#searchinput").parent();
    var oIndex = input.data("button");
    if (oIndex) {
        var oButton = $("#searchbutton" + oIndex).parent();
        oButton.show();
        var width = oButton.width();
        oButton.removeClass("animated");
        oButton.css("width", input.width());

        setTimeout(function () {
            oButton.addClass("animated");
            oButton.css("width", width)

        }, 50)
    }
    input.data("button", index + 1);

    var button = $("#searchbutton" + (index + 1)).parent();

    input.removeClass("animated");
    if (!noAnimation)
        input.css("width", button.width());
    setTimeout(function () {
        if (!noAnimation)
            input.addClass("animated");

        input.css("width", "");
        setTimeout(function () {
            input.find("input").focus();
        }, 500)

        uiController.toggleSearchButton(index + 1);

    }, 60)

    switch (index) {
        case 0:
            $("#searchinput").val(searchController.searchSongsString);
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Songs");
            break;
        case 1:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Popular Songs");
            break;
        case 2:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Suggestions");
            break;
        case 3:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Playlists");
            break;
    }


    button.hide();
}


searchController.completeSearch = function (list, appendListInFront, searchID) {

    if (searchController.searchCounter == searchID) {

        uiController.searchListScroll.scrollTo(0, 0, 1000)
        var changed = false;
        if (searchController.searchResults.length == 0) {
            changed = true;
        }
        else if (list.track) {
            if (list.track.length != searchController.searchResults.length) {
                changed = true;
            }
            else {
                for (var i = 0; i < searchController.searchResults.length; i++) {
                    if (mediaController.getSongArtist(searchController.searchResults[i]) != mediaController.getSongArtist(list.track[i])) {
                        changed = true;
                        break;
                    }
                    if (searchController.searchResults[i].name != list.track[i].name) {
                        changed = true;
                        break;
                    }
                }
            }
        }
        if (changed) {
            if (appendListInFront) {
                for (var j = 0; j < appendListInFront.length; j++) {
                    for (i = 0; i < list.track.length; i++) {
                        if (mediaController.getSongDisplayName(list.track[i]) == mediaController.getSongDisplayName(appendListInFront[j])) {
                            list.track.splice(i, 0);
                        }

                    }
                }
                searchController.searchResults = appendListInFront;
                var anzSongs = searchController.searchResults.length;

            }
            else {
                searchController.searchResults = [];
                anzSongs = 0;
            }

            $scope.safeApply();
            var num = 1;
            if (list.track.length) {
                num = Math.min(searchController.maxResults, list.track.length);

                for (i = anzSongs; i < num + anzSongs; i++) {
                    searchController.searchResults[i] = list.track[i - anzSongs];
                }
                if (appendListInFront)
                    searchController.searchResultsComplete = appendListInFront.concat(list.track);
                else
                    searchController.searchResultsComplete = list.track;


            }
            else {
                searchController.searchResults[anzSongs] = list.track;
                searchController.searchResultsComplete = [];
                searchController.searchResultsComplete[anzSongs] = list.track[0];
            }

            for (i = 0; i < searchController.searchResults.length; i++) {
                searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
            }

            console.log("----------------------")
            console.dir(searchController.searchResults)


            $scope.safeApply();
            $("#searchlistview").listview('refresh');

            playbackController.remarkSong();


            searchController.makeSearchListDraggable();
            setTimeout(function () {
                $("#searchlistview li").removeClass("fadeincompletefast");


            }, 100)
            setTimeout(function () {
                uiController.searchListScroll.refresh();

            }, 1000)
        }
    }
}

searchController.filterMusic = function () {
    if ($("#searchinput").val() && $("#searchinput").val() != "") {
        searchController.lastSearchTerm = $("#searchinput").val();
        if (app.isCordova)
            var time = 1000;
        else
            time = 300;

        setTimeout(function () {
            if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
                    searchController.autoSearchTimer = Date.now();
                    searchController.lastSearchedTerm = searchController.lastSearchTerm;
                    searchController.filterSongs(searchController.lastSearchTerm);
                }
            }
        }, time);

        if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
            searchController.autoSearchTimer = Date.now();
            searchController.lastSearchedTerm = searchController.lastSearchTerm;
            searchController.filterSongs(searchController.lastSearchTerm);
        }
    }
    else {
        searchController.removeFilterSongs();
    }
}

searchController.removeFilterSongs = function () {
    uiController.searchListScroll.scrollTo(0, 0, 1000)
    searchController.searchResults = [];
    $scope.safeApply();
    var num = Math.min(searchController.maxResults, searchController.searchResultsComplete.length);
    for (var i = 0; i < num; i++) {
        searchController.searchResults[i] = searchController.searchResultsComplete[i];
    }

    for (var i = 0; i < searchController.searchResults.length; i++) {
        searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
    }
    $scope.safeApply();
    playbackController.remarkSong();

    $("#searchlistview").listview('refresh');

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 1000)
    searchController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)
}


searchController.filterSongs = function (filterTerm) {

    uiController.searchListScroll.scrollTo(0, 0, 1000)

    filterTerm = filterTerm.toLowerCase();
    var changed = false;
    var title = "";
    var artist = "";
    var newSearchResults = [];
    if (searchController.searchResultsComplete == 0) {
        changed = true;
    }
    else {
        var icounter = 0;
        for (var i = 0; i < searchController.searchResultsComplete.length; i++) {
            artist = mediaController.getSongArtist(searchController.searchResultsComplete[i]);
            title = searchController.searchResultsComplete[i].name;
            artist = artist.toLowerCase();
            title = title.toLowerCase();

            if (title.search(filterTerm) > -1 || artist.search(filterTerm) > -1) {
                newSearchResults[icounter] = searchController.searchResultsComplete[i];
                // console.dir(searchController.searchResults[icounter]);
                icounter++;
            }
        }
        if (searchController.searchResults.length != newSearchResults.length) {
            changed = true;
        }
        else {
            for (var i = 0; i < searchController.searchResults.length; i++) {
                if (mediaController.getSongArtist(searchController.searchResults[i]) != mediaController.getSongArtist(newSearchResults[i])) {
                    changed = true;
                    break;
                }
                if (searchController.searchResults[i].name != newSearchResults[i].name) {
                    changed = true;
                    break;
                }
            }
        }
    }
    if (changed) {
        searchController.searchResults = [];
        $scope.safeApply();
        var num = Math.min(searchController.maxResults, newSearchResults.length);
        for (var i = 0; i < num; i++) {
            searchController.searchResults[i] = newSearchResults[i];
        }
        for (var i = 0; i < searchController.searchResults.length; i++) {
            searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
        }
        $scope.safeApply();
        $("#searchlistview").listview('refresh');

        setTimeout(function () {
            uiController.searchListScroll.refresh();
        }, 1000)
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}


searchController.showPopulars = function () {
    if (searchController.preloadedPopularSongs)
        setTimeout(function () {
            searchController.completeSearch(searchController.preloadedPopularSongs, null, searchController.searchCounter)
        }, 500)
    else {

        setTimeout(function () {

            searchController.searchCounter++;
            function search(searchID) {
                searchController.topTracks(function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }

            search(searchController.searchCounter);


        }, 500)

    }
}

searchController.emptySearchList = function (dontInitFully) {
    searchController.searchCounter++;
    searchController.showLoading(false);
    searchController.searchResults = [];
    $scope.safeApply();

    $("#searchlistview").listview('refresh');
    $("#searchlist .iScrollPlayIndicator").hide();
    playbackController.positionPlayIndicatorAtTop(true);


    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 0)

    if (!dontInitFully) {
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}

searchController.showSearchList = function () {
    searchController.searchMusic();
}

searchController.showSuggestions = function () {
    setTimeout(function () {
        var index;
        var song;
        if (mediaController.currentvideoURL != "") {
            song = playbackController.getPlayingSong();
        }
        else {
            if (playlistController.loadedPlaylistSongs.length > 0) {
                index = Math.round(Math.random() * (playlistController.loadedPlaylistSongs.length - 1));

                song = playlistController.loadedPlaylistSongs[index];
            }
            else if (searchController.searchResults.length > 0) {
                index = Math.round(Math.random() * (searchController.searchResults.length - 1));
                song = searchController.searchResults[index];
            }
        }
        searchController.searchCounter++;
        function search(searchID) {
            if (song) {
                searchController.suggestions(song.name, mediaController.getSongArtist(song), function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }
            else {
                searchController.topTracks(function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }
        }

        search(searchController.searchCounter);


    }, 500)

}


searchController.showPlaylists = function () {


}


searchController.searchArtistSongs = function (artist) {
    $("#searchinput").val(artist);
    searchController.searchSongsString = artist;
    searchController.activateButton(0);
    searchController.searchCounter++;
    function search(searchID) {
        searchController.searchSongsFromArtist(artist, function (list) {
            searchController.completeSearch(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchSimilarSongs = function (song) {

    searchController.activateButton(2);

    searchController.searchCounter++;
    function search(searchID) {
        searchController.suggestions(song.name, mediaController.getSongArtist(song), function (list) {
            searchController.completeSearch(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchMusic = function () {
    if ($("#searchinput").val() && $("#searchinput").val() != "") {
        searchController.lastSearchTerm = $("#searchinput").val();
        var song = playbackController.getPlayingSong();
        if (song.name != "" && $("#searchinput").val() != "") {
            window.history.pushState("", document.title, "/?search=" + searchController.lastSearchTerm + "&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
        }
        else {
            window.history.pushState("", document.title, "?search=" + searchController.lastSearchTerm);
        }
        if (searchController.serverSearch) {
            var time = 1500;
        }
        else {
            if (app.isCordova)
                time = 1000;
            else
                time = 300;
        }

        setTimeout(function () {
            if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
                    searchController.autoSearchTimer = Date.now();
                    searchController.lastSearchedTerm = searchController.lastSearchTerm;
                    searchController.searchCounter++;
                    function search(searchID) {
                        searchController.searchSongs(searchController.lastSearchTerm, "", "", function (list) {
                            searchController.completeSearch(list, null, searchID)
                        });
                    }

                    search(searchController.searchCounter);
                }
            }
        }, time);

        if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
            searchController.autoSearchTimer = Date.now();
            searchController.lastSearchedTerm = searchController.lastSearchTerm;
            searchController.searchCounter++;
            function search(searchID) {
                searchController.searchSongs(searchController.lastSearchTerm, "", "", function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }

            search(searchController.searchCounter);
        }
    }
    else {
        searchController.emptySearchList();
    }
}


searchController.showLoading = function (show) {

    if (show)
        $(".ui-alt-icon.ui-icon-search, .ui-alt-icon .ui-icon-search, .ui-input-search").addClass("loading");
    else
        $(".ui-alt-icon.ui-icon-search, .ui-alt-icon .ui-icon-search, .ui-input-search").removeClass("loading");

}


searchController.searchSongs = function (searchString, title, artist, callbackSuccess) {
    searchController.showLoading(true);

    var searchserver = function () {
        console.dir(preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token);
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                console.dir("searchjson!!!!!!!!!!");
                console.dir(data);
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver();
                }
                else {

                    for (var i = 0; i < data.track.length; i++) {
                        try {
                            data.track[i].artist = decodeURIComponent(data.track[i].artist);
                        }
                        catch (e) {
                            data.track[i].artist = unescape(data.track[i].artist);
                        }
                        try {
                            data.track[i].name = decodeURIComponent(data.track[i].name);
                        }
                        catch (e) {
                            data.track[i].name = unescape(data.track[i].name);
                        }
                    }
                    setTimeout(searchController.showLoading, 1000); //show=false
                    if (callbackSuccess)
                        callbackSuccess(data);

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                /*alert(xhr.status);
                 alert(thrownError); */
                console.dir("ERROR!");
                console.dir(xhr.responseText);

                setTimeout(searchController.showLoading, 1000); //show=false

            }

        })
    }

    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            if (data.results && data.results.trackmatches) {
                if (data.results.trackmatches == "\n") {
                    searchController.serverSearch = true;
                    searchserver();
                }
                else {
                    searchController.serverSearch = false;

                    setTimeout(searchController.showLoading, 1000);
                    if (callbackSuccess)
                        callbackSuccess(data.results.trackmatches);


                }
            }
            else {
                searchController.serverSearch = true;
                searchserver();
            }


        },
        error: function () {

            searchController.serverSearch = true;
            searchserver();

        }
    })

}


searchController.searchSongsFromArtist = function (artist, callbackSuccess) {
    searchController.showLoading(true);

    var searchString = artist;

    var searchserver = function () {
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver();
                }
                else {
                    for (var i = 0; i < data.track.length; i++) {
                        try {
                            data.track[i].artist = decodeURIComponent(data.track[i].artist);
                        }
                        catch (e) {
                            data.track[i].artist = unescape(data.track[i].artist);
                        }
                        try {
                            data.track[i].name = decodeURIComponent(data.track[i].name);
                        }
                        catch (e) {
                            data.track[i].name = unescape(data.track[i].name);
                        }
                    }
                    setTimeout(searchController.showLoading, 1000); //show=false
                    if (callbackSuccess)
                        callbackSuccess(data);

                }
            },
            error: function () {
                setTimeout(searchController.showLoading, 1000); //show=false

            }

        })
    }
    var func = function (page, topresults) {
        $.ajax({

            url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchString + "&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                var dataOK = false;
                if (data.toptracks) {
                    if (data.toptracks == "\n" && page == 1) {
                        searchserver();
                    }
                    else {
                        dataOK = true;
                        if (page == 1) {
                            func(page + 1, data.toptracks.track);
                        }
                        else if (page < searchController.maxArtistSongPages) {
                            topresults = topresults.concat(data.toptracks.track);
                            func(page + 1, topresults);

                        }
                        else if (page >= searchController.maxArtistSongPages) {
                            topresults = topresults.concat(data.toptracks.track);
                            topresults.track = topresults;
                            if (callbackSuccess)
                                callbackSuccess(topresults);
                            setTimeout(searchController.showLoading, 1000);
                        }
                    }
                }
                if (dataOK == false && page > 1 && topresults) {
                    topresults.track = topresults;
                    if (callbackSuccess)
                        callbackSuccess(topresults);
                }

            },
            error: function () {
                searchserver(searchID);

            }
        })
    }
    func(1, null);
}

searchController.topTracks = function (callbackSuccess) {

    searchController.showLoading(true);

    //TODO TEEEMMMMMMPPPPPP for no Internet
    /* if (callbackSuccess)
     callbackSuccess( {track:   playlistController.NOINTERNETHACK});
     return;
     */

    var func = function (page, topresults) {
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                var dataOK = false;
                if (data.tracks) {
                    if (data.tracks != "\n") {
                        dataOK = true;
                        if (page == 1) {

                            func(page + 1, data.tracks.track);
                        }
                        else if (page < searchController.maxPopularSongPages) {
                            topresults = topresults.concat(data.tracks.track);
                            func(page + 1, topresults);
                        }
                        else if (page >= searchController.maxPopularSongPages) {
                            topresults = topresults.concat(data.tracks.track);
                            topresults.track = topresults;
                            if (callbackSuccess)
                                callbackSuccess(topresults);
                            setTimeout(searchController.showLoading, 1000);
                        }
                    }
                }
                if (dataOK == false && page > 1 && topresults) {
                    if (callbackSuccess)
                        callbackSuccess(topresults);
                }

            }, error: function () {
                setTimeout(searchController.showLoading, 1000);
            }
        })
    }
    func(1, null);
}

searchController.suggestions = function (title, artist, callbackSuccess) {
    searchController.showLoading(true);
    $.ajax({

        url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + artist + "&track=" + title + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            if (data.similartracks) {
                if (data.similartracks != "\n") {
                    if (callbackSuccess)
                        callbackSuccess(data.similartracks);


                }
            }
        }, complete: function () {
            setTimeout(searchController.showLoading, 1000);
        }
    })

}


searchController.getArtistInfo = function () {

    $.ajax({

        url: "&search=",
        success: function (data) {

            if (data) {


            }
        }
    })


}


/**
 * Make  Searchlist Drag and Droppable
 */
searchController.dragDraggableSongTimer = 0;
searchController.makeSearchListDraggable = function () {

    $("#searchlist li").on("mousedown",function (event) {

        if ($(this).parents("#searchlist").length == 0)
            return;
        if (!searchController.dragDraggableLastSongTimer || Date.now() - searchController.dragDraggableLastSongTimer > 500) {
            searchController.dragDraggableSongX = event.clientX;
            searchController.dragDraggableSongY = event.clientY;
            searchController.dragDraggableSongTimer = Date.now();
            searchController.dragDraggableSongStartEvent = event;
        } else
            searchController.dragDraggableSongTimer = 0;
    }).on("mouseup ",function (event) {
            if ($(this).parents("#searchlist").length == 0)
                return;
            if (Math.abs(event.clientY - searchController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
                searchController.dragDraggableSongY = -10;
            }
            searchController.dragDraggableSongTimer = 0;

        }).on("mousemove", function (event) {

            if ($(this).parents("#searchlist").length == 0)
                return;
            if (Math.abs(event.clientY - searchController.dragDraggableSongY) > 8)
                searchController.dragDraggableSongY = -10;
            if (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            } else if (searchController.dragDraggableSongTimer && Date.now() - searchController.dragDraggableSongTimer < 500) {
                if (!uiController.draggingSong && event.clientX - searchController.dragDraggableSongX > 2 && Math.abs(event.clientY - searchController.dragDraggableSongY) < Math.abs(event.clientX - searchController.dragDraggableSongX) * 0.8) {
                    searchController.dragDraggableSongY = -10;
                    searchController.dragDraggableLastSongTimer = Date.now();
                    searchController.dragDraggableSongTimer = 0;

                    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
                        $("#saveplaylistinpt").val("");
                        $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");
                        playlistController.loadedPlaylistSongs = [];
                        $("#saveplaylistbtn img").attr("src", "public/img/save.png");
                        $scope.safeApply();
                        $("#clearChoosenPlaylists").show();
                    }

                    $("#searchlistview .draggableSong").draggable("enable");

                    if (!uiController.sidePanelOpen && uiController.windowWidth < uiController.responsiveWidthSmallest) {
                        uiController.startedSortPlaylistOpenedPanel = true;
                        uiController.toggleSidePanel();
                        var delay = 150;

                    } else {
                        uiController.startedSortPlaylistOpenedPanel = false;
                        delay = 0;
                    }

                    var that = this;
                    console.log(uiController.startedSortPlaylistOpenedPanel)
                    var coords = {
                        clientX: searchController.dragDraggableSongStartEvent.clientX,
                        clientY: searchController.dragDraggableSongStartEvent.clientY
                    };
                    $(that).simulate("mouseup", coords);

                    setTimeout(function () {
                        if (!playlistController.sortPlaylist) {
                            playlistController.toggleSortablePlaylist(true);
                            uiController.startedSortPlaylist = true;
                        } else
                            uiController.startedSortPlaylist = false;
                        $(".sortable").sortable("enable");

                        $(that).simulate("mousedown", coords);

                    }, delay)
                }
            }
        })


    if (app.isCordova)
        return;


    $('#searchlistview .draggableSong').draggable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: false,

        //   containment: "body",
        connectToSortable: '#playlistview',

        helper: function (event, ui) {
            $("#songOptions").appendTo("body").hide();


            if (!$(this).hasClass("selected")) {
                $("#searchlist li.selected").removeClass("selected")
                $(this).addClass("selected");
            }

            var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsearchlistelement');

            var elements = $("#searchlist li.selected").removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

            if (elements.length == 0) {
                elements = $(this).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");
                elements.removeClass("fadeslideincompletefast");
                elements.addClass("margintop");

            } else {
                elements.removeClass("fadeslideincompletefast");
                $(elements.get(0)).addClass("margintop");

            }

            $("#playlistplaceholder").remove();


            var eleHeight = (65 * elements.length);
            if (eleHeight > $("#playlistInner").height() * 0.7) {
                eleHeight = Math.floor($("#playlistInner").height() * 0.7 / 65) * 65;

            }
            if (eleHeight < 65)
                eleHeight = 65;
            $("<style type='text/css' id='playlistplaceholder'> #playlistInner ul .ui-sortable-placeholder{ height:" + eleHeight + "px !important} </style>").appendTo("head");


            var ele = $helper.append(elements)

            playlistController.draggedElements = elements;

            playlistController.draggedElement = ele.find("li[data-songid='" + $(this).data("songid") + "'] ");
            $(".songlist").addClass("nohover");

            ele.css("opacity", "0");

            //var marquee = $(ele).find("marquee").get(0);
            // $(marquee).replaceWith($(marquee).contents());

            return ele;
        }, drag: function (event, ui) {
            return !uiController.stopDrag;
        },
        start: function (event) {
            playlistController.hideSongOptions();

            //  setTimeout(function () {debugger}, 3000)
            uiController.draggingSong = true;
            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();
            var ele = $(playlistController.draggedElements.get(0)).parent();
            setTimeout(function () {
                ele.attr('style', ele.attr('style') + '; ' + "margin-top:" + (-(playlistController.draggedElement.offset().top - playlistController.draggedElements.offset().top)) + "px" + ' !important');
                ele.css("opacity", "1");
            }, 0)


            $(".draggedsearchlistelement").on('mousemove', function (event) {
                if (uiController.draggingSong) {

                    //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );

                    if ($("#playlistInner").offset().top - $(".draggedsearchlistelement").offset().top > 10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, 100, 1000)

                        }

                    } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - $(".draggedsearchlistelement").offset().top - $(".draggedsearchlistelement").height() < -10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, -100, 1000)
                        }

                    }

                }
            });


        },
        stop: function (event, ui) {
            $(".songlist").removeClass("nohover");

            var ele = $(playlistController.draggedElements.get(0)).parent();
            ele.attr('style', ele.attr('style') + '; ' + "margin-top:0px" + ' !important');
            ele.addClass("animatemargin");

            $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");
            uiController.draggingSong = false;
            $(this).css("opacity", "1")
            setTimeout(function () {
                $("#searchlist li").simulate("mouseup");
            }, 0)
            if (uiController.startedSortPlaylistOpenedPanel)
                setTimeout(function () {
                    uiController.toggleSidePanel();
                }, 500)

            if (uiController.startedSortPlaylist) {
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }


        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    });

    $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");

}


/*
 var func = function(){
 alert(1000);
 }

 var func2 = function(){
 alert(1000);
 }
 var func3 = function(){
 alert(1000);
 }

 setTimeout(func,0)
 setTimeout(func2,0)
 setTimeout(func3,0)



 console.log("sfdsfsdfsf")
 console.dir(this)

 */