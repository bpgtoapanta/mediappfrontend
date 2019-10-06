# mediappfrontend
Tarea final frontend
Para la creación de la nueva opción en menú signos los scripts para base de datos y asignación de rol ADMIN

INSERT INTO menu(id_menu, nombre, icono, url) VALUES (9, 'Signos', 'assignment_ind', '/signos');

INSERT INTO menu_rol (id_menu, id_rol) VALUES (9, 1);
