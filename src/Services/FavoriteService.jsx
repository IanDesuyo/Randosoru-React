import { BehaviorSubject } from "rxjs";

let favData = JSON.parse(localStorage.getItem("favorite"))
if (!favData) {favData = {}}
const FavSubject = new BehaviorSubject(favData);

export const FavoriteService = {
    set,
    remove,
    check,
    favData: FavSubject.asObservable(),
    get getList() {
      return FavSubject.value;
    },
  };

function check(form_id) {
    let data = FavSubject.value;
    if (data[form_id] !== undefined) return true;
    return false;
}

function set(form_id, week, title) {
    let data = FavSubject.value;
    data[form_id] = {week: week, title: title};
    localStorage.setItem("favorite", JSON.stringify(data))
    FavSubject.next(data);
}

function remove(form_id) {
    let data = FavSubject.value;
    delete data[form_id];
    localStorage.setItem("favorite", JSON.stringify(data))
    FavSubject.next(data);
}