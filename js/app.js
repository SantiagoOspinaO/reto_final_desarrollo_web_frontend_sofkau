const d = document,
    $table = d.querySelector(".table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment();

const getAll = async() => {
    try {
        let res = await fetch("http://localhost:8080/tasklist"),
            json = await res.json();

        if (!res.ok) throw {
            status: res.status,
            statusText: res.statusText
        };

        console.log(json);
        json.forEach(el => {
            $template.querySelector(".id").textContent = el.id;
            $template.querySelector(".name").textContent = el.name;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.name;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}
d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {

            try {
                let options = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            name: e.target.nombre.value
                        })
                    },
                    res = await fetch("http://localhost:8080/tasklist", options),
                    json = await res.json();

                if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        } else {
            try {
                let options = {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            name: e.target.nombre.value
                        })
                    },
                    res = await fetch(`http://localhost:8080/tasklist/${e.target.id.value}`, options),
                    json = await res.json();

                if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});

d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Update";
        $form.nombre.value = e.target.dataset.name;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Desea eliminar la tarea con id ${e.target.dataset.id}?`);

        if (isDelete) {
            try {
                let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        }
                    },
                    res = await fetch(`http://localhost:8080/tasklist/${e.target.dataset.id}`, options),
                    json = await res.json();

                  if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                  };
                location.reload();

            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status}: ${message}`);
                location.reload();
            }
        }
    }
})