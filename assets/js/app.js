const cl = console.log

const movieModal = document.getElementById('movieModal')
const showMovieBtn = document.getElementById('showMovieBtn')
const spinner = document.getElementById('spinner')

const movieForm = document.getElementById('movieForm')
const movieContainer = document.getElementById('movieContainer')
const movieName = document.getElementById('movieName')
const movieImage = document.getElementById('movieImage')
const movieDescription = document.getElementById('movieDescription')
const movieRating = document.getElementById('movieRating')
const movieGener = document.getElementById('movieGener')
const movieReleaseDate = document.getElementById('movieReleaseDate')
const addMovieBtn = document.getElementById('addMovieBtn')
const changeTxt = document.getElementById('changeTxt')

const updateMovieBtn = document.getElementById('updateMovieBtn')
const closeMovieModal = [...document.querySelectorAll('.closeMovieModal')]


const baseUrl = `https://studentpost-5eee3-default-rtdb.asia-southeast1.firebasedatabase.app`
const movieUrl = `${baseUrl}/movieWithoutGeneric.json`




const state = {
    moviesArr: [],
    Editid: null
}

function objToArr(obj) {
    for (const key in obj) {
        obj[key].id = key,
            state.moviesArr.unshift(obj[key])



    }
}


function setRating(rating) {
    if (rating >= 4) {
        return "badge-success"
    } else if (rating >= 3 && rating < 4) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }

}

function showSpinner() {
    spinner.classList.remove('d-none');
}
function hideSpinner() {
    spinner.classList.add('d-none');
}

function snackBar(msg, icon) {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2500,
        confirmButtonColor: "#212529"
    })
}

function onModalToggle() {
    const changeTxt = document.getElementById('changeTxt')
    movieModal.classList.toggle('active')
    backDrop.classList.toggle('active')
    changeTxt.innerHTML = 'Add Movie'

    movieForm.reset()
    updateMovieBtn.classList.add('d-none')
    addMovieBtn.classList.remove('d-none')


}






function readMovie(arr) {
    let result = ``
    arr.forEach(movie => {
        result += `  
           <div class="col-md-3 mb-4" id="${movie.id}">
                <div class="card movieCard mt-4 h-100">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${movie.movieName}</h4>
                            </div>
                            <div class="col-2">
                                <h5  class="m-0">
                                 <span class="badge ${setRating(movie.movieRating)}">${movie.movieRating}</span> 

                                </h5>
                            </div>

                        </div>
                         <small class ="pl-2 text-secondary" > <strong> CreatedAt: </strong>${new Date(movie.createdAt).toLocaleString("en-In")}</small> <br>
                          ${movie.updatedAt ? `<small class = "pl-2 text-secondary"> <strong> updatedAt : </strong>${new Date(movie.updatedAt).toLocaleString("en-IN")}</small>` : ""}
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${movie.movieImg}" alt="${movie.movieName}"
                                title="${movie.movieName}">
                            <figcaption>
                                <h3>${movie.movieName}</h3>
                                <div class ="text-secondary">
                                    <h5>${movie.movieGener}</h5>
                                    <h6>Release Date: ${movie.movieReleaseDate}</h6>
                                </div>
                                <p>${movie.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onClick= "onMovieEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button onClick= "onMovieRemove(this)" class="btn btn-danger btn-sm">Remove</button>

                    </div>
                </div>
            </div>`
        movieContainer.innerHTML = result;

    });
}


function fetchMovie() {
    showSpinner()
    return fetch(movieUrl, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new error
            }

            return res.json()
        })
        .then(data => {
            objToArr(data)
            readMovie(state.moviesArr)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })
}

fetchMovie()


function onMovieAdd(eve) {

    eve.preventDefault()
    let newMovie = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        movieGener: movieGener.value,
        movieReleaseDate: movieReleaseDate.value,
        createdAt: Date.now(),
        updatedAt: null

    }
    onModalToggle()
    showSpinner()
    return fetch(movieUrl, {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new error
            }

            return res.json()
        })
        .then(data => {
            newMovie.id = data.name;
            state.moviesArr.unshift(newMovie)
            let card = document.createElement('div')
            card.id = data.name
            card.className = 'col-md-3 mb-4 '
            card.innerHTML = ` <div class="card movieCard mt-4 mb-4 h-100">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${newMovie.movieName}</h4>
                            </div>
                            <div class="col-2">
                                <h5  class="m-0">
                                         <span class="badge ${setRating(newMovie.movieRating)}">${newMovie.movieRating}</span> 

                                </h5>
                            </div>

                        </div>
                         <small class ="pl-2 text-secondary" > <strong> CreatedAt: </strong>${new Date(newMovie.createdAt).toLocaleString("en-In")}</small>
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${newMovie.movieImg}" alt="${newMovie.movieName}"
                                title="${newMovie.movieName}">
                            <figcaption>
                                <h3>${newMovie.movieName}</h3>
                                <div class ="text-secondary">
                                    <h5>${newMovie.movieGener}</h5>
                                    <h6>Release Date: ${newMovie.movieReleaseDate}</h6>
                                </div>
                                <p>${newMovie.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick= "onMovieEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button  onClick= "onMovieRemove(this)" class="btn btn-danger btn-sm">Remove</button>

                    </div>
                </div>
            
                        
                `
            movieContainer.prepend(card)
             snackBar(`The Movie with id: ${newMovie.id} is added successfully !!!`, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })



}


function onMovieEdit(ele) {
    let editId = ele.closest('.col-md-3').id;
    state.Editid = editId;

    onModalToggle()
    changeTxt.innerHTML = 'Update Movie'

    let editObj = state.moviesArr.find(m => m.id === editId);

    movieName.value = editObj.movieName;
    movieImg.value = editObj.movieImg;
    movieDescription.value = editObj.movieDescription;
    movieGener.value = editObj.movieGener;
    movieRating.value = editObj.movieRating;
    movieReleaseDate.value = editObj.movieReleaseDate;

    addMovieBtn.classList.add('d-none')
    updateMovieBtn.classList.remove('d-none')

}


function onMovieUpdate() {
    let udpateId = state.Editid;

    let updatedUrl = `${baseUrl}/movieWithoutGeneric/${udpateId}.json`

    let movie = state.moviesArr.find(m => m.id === udpateId)


    let updatedMovie = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        movieGener: movieGener.value,
        movieReleaseDate: movieReleaseDate.value,
        id: udpateId,
        createdAt: movie.createdAt,

        updatedAt: Date.now()
    }

    onModalToggle()
    showSpinner()
    return fetch(updatedUrl, {
        method: "PATCH",
        body: JSON.stringify(updatedMovie),
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error
            }
            return res.json()
        })
        .then(data => {
            let updateIdx = state.moviesArr.findIndex(m => m.id === udpateId)
            state.moviesArr[updateIdx] = updatedMovie

            let col = document.getElementById(udpateId)
            col.innerHTML = `
            <div class="card movieCard mt-4  h-100">
                    <div class="card-header ">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${updatedMovie.movieName}</h4>
                            </div>
                            <div class="col-2">
                                <h5  class="m-0">
                                 <span class="badge ${setRating(updatedMovie.movieRating)}">${updatedMovie.movieRating}</span> 

                                </h5>
                            </div>

                        </div>
                         <small class="pl-2 text-secondary"> <strong> Created: </strong>${new Date(updatedMovie.createdAt).toLocaleString("en-In")}</small><br>
                        <small class="pl-2 text-secondary"> <strong> UpdatedAt: </strong>${new Date(updatedMovie.updatedAt).toLocaleString("en-In")}</small>
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${updatedMovie.movieImg}" alt="${updatedMovie.movieName}"
                                title="${updatedMovie.movieName}">
                            <figcaption>
                                <h3>${updatedMovie.movieName}</h3>
                                <div class ="text-secondary">
                                    <h5>${updatedMovie.movieGener}</h5>
                                    <h6>Release Date: ${updatedMovie.movieReleaseDate}</h6>
                                </div>
                                <p>${updatedMovie.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick= "onMovieEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button  onClick= "onMovieRemove(this)" class="btn btn-danger btn-sm">Remove</button>

                    </div>
                </div>
        
        
            `
             snackBar(`The Movie with id: ${udpateId} is updated successfully !!!`, 'success')


        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}



function onMovieRemove(ele) {
    let removeId = ele.closest(".col-md-3").id;





Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#212529",
  cancelButtonColor: "rgb(193, 17, 25)",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
    let removeUrl = `${baseUrl}/movieWithoutGeneric/${removeId}.json`
    showSpinner()
  if (result.isConfirmed) {
     return fetch(removeUrl, {
        method: "DELETE",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error
            }
            return res.json()
        })
        .then(data => {
            let removeObj = state.moviesArr.findIndex(m => m.id === removeId);
            state.moviesArr.splice(removeObj, 1)

            ele.closest(".col-md-3").remove();
             snackBar(`The Movie with id: ${removeId} is removed successfully !!!`, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })


  }
});


}












   


showMovieBtn.addEventListener('click', onModalToggle)

closeMovieModal.forEach(ele => {
    ele.addEventListener('click', onModalToggle)
})


updateMovieBtn.addEventListener("click", onMovieUpdate)
movieForm.addEventListener("submit", onMovieAdd)