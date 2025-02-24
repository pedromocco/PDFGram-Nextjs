import { useState, useEffect } from "react";
import {
  Footer,
  Button,
  Modal,
  Toast,
  Table,
  TextInput,
  Banner,
} from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function Home() {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastIcon, setToastIcon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWipe, setShowWipe] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [ref, setRef] = useState("");
  const [money, setMoney] = useState("");

  useEffect(() => {
    fetch("api/bot")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    const storedData = localStorage.getItem("pagoMovilData");
    if (storedData) {
      setData(JSON.parse(storedData));
      setShowTable(true);
    }
  }, []);

  const handleDelete = (recordToDelete) => {
    const updatedData = data.filter(
      (record) => record.ref !== recordToDelete.ref
    );
    localStorage.setItem("pagoMovilData", JSON.stringify(updatedData));
    setData(updatedData);
    setShowDeleteModal(false);
  };

  const handleWipe = () => {
    localStorage.setItem("pagoMovilData", JSON.stringify([]));
    setData([]);
    setShowWipe(false);
  };

  const saveData = async () => {
    setIsSending(true);
    setToastMessage("Enviando datos...");
    setToastIcon(
      <HiExclamation className="h-5 w-5 text-orange-600 dark:text-orange-500" />
    );
    setShowToast(true);

    try {
      const response = await fetch("api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setData([]);
        setShowTable(false);
        setOpenModal(false);
        setToastMessage("Datos enviados correctamente.");
        setToastIcon(
          <HiCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
        );
      } else {
        setOpenModal(false);
        setToastMessage("Error al enviar los datos. Inténtalo de nuevo.");
        setToastIcon(
          <HiX className="h-5 w-5 text-red-600 dark:text-red-500" />
        );
      }
    } catch (error) {
      setOpenModal(false);
      setToastMessage("Error al enviar los datos. Inténtalo de nuevo.");
      setToastIcon(<HiX className="h-5 w-5 text-red-600 dark:text-red-500" />);
      console.error("Error:", error);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }

    localStorage.setItem("pagoMovilData", JSON.stringify([]));
  };
  const downloadData = async () => {
    try {
      // Realiza la solicitud POST al backend
      const response = await fetch("api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setToastMessage("datos descargados");
        setToastIcon(
          <HiExclamation className="h-5 w-5 text-orange-600 dark:text-orange-500" />
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        throw new Error("Error al descargar el archivo");
      }

      // Convierte la respuesta en un blob (archivo binario)
      const blob = await response.blob();

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Registro de pago movil ${
        new Date().toISOString().split("T")[0]
      }.pdf`; // Nombre del archivo
      document.body.appendChild(a);
      a.click();

      // Limpia el enlace temporal
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al descargar el archivo.");
    }

    localStorage.setItem("pagoMovilData", JSON.stringify([]));
  };

  const addRecord = (e) => {
    e.preventDefault();
    const exists = data.some((record) => record.ref === ref);
    if (exists) {
      setToastMessage(
        "El número de referencia ya existe. Por favor, ingresa un número diferente."
      );
      setToastIcon(
        <HiExclamation className="h-5 w-5 text-orange-600 dark:text-orange-500" />
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    }

    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const record = {
      ref: ref,
      money: parseFloat(money).toFixed(2),
      date: new Date().toLocaleString("es-VE", options),
    };

    const newData = [...data, record];
    setData(newData);
    localStorage.setItem("pagoMovilData", JSON.stringify(newData));
    setShowTable(true);
    setRef("");
    setMoney("");
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 p-2">
      <div className="relative inline-block mt-5">
        <span className="text-5xl font-bold">PDFgram</span>
        <span className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600 rounded-full"></span>
      </div>

      <div className="w-full max-w-md mt-6">
        <form onSubmit={addRecord} className="flex flex-col space-y-2">
          <label className="text-sm text-slate-500 font-semibold">
            Número de referencia
          </label>
          <TextInput
            placeholder="Últimos 4 dígitos del número de referencia"
            id="ref"
            type="text"
            value={ref}
            minLength={4}
            maxLength={4}
            pattern="\d{4}"
            required
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,4}$/.test(value)) {
                setRef(value);
              }
            }}
          />

          <label className="text-sm text-slate-500 font-semibold">Monto</label>
          <TextInput
            placeholder="Ingresa el monto del pago móvil"
            addon="Bs"
            id="money"
            type="number"
            value={money}
            min={0.01}
            step={0.01}
            required
            onChange={(e) => {
              setMoney(e.target.value);
            }}
          />

          <div className="flex flex-column justify-center gap-x-3">
            <Button type="submit" color="blue">
              Añadir
            </Button>
            <Button color="blue" onClick={downloadData}>
              Descargar
            </Button>
            <Button
              className=""
              color="red"
              onClick={() => {
                setShowWipe(true);
              }}
            >
              Vaciar
            </Button>
          </div>
        </form>
      </div>

      {showTable && (
        <div>
          <div className="flex flex-col">
            <Table className="w-full max-w-md mt-3 gap-y-4">
              <Table.Head>
                <Table.HeadCell>Referencia</Table.HeadCell>
                <Table.HeadCell>Monto</Table.HeadCell>
                <Table.HeadCell>Hora</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {data?.map((record, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{record.ref}</Table.Cell>
                    <Table.Cell>{record.money} Bs</Table.Cell>
                    <Table.Cell>{record.date}</Table.Cell>
                    <Table.Cell>
                      <button
                        className="text-red-600 hover:text-red-800 font-bold py-1 px-2 rounded flex items-center gap-1"
                        onClick={() => {
                          setRecordToDelete(record);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setOpenModal(true)}
              className="mt-8 w-auto"
              color="blue"
              pill
              disabled={isSending || data.length === 0}
            >
              {isSending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      )}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Aviso Importante</Modal.Header>
        <Modal.Body>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Los datos ingresados serán enviados a un bot de Telegram para su
            procesamiento. Una vez que los datos sean enviados, la tabla se
            reiniciará. ¿Deseas continuar?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={saveData}
            className="w-auto"
            disabled={isSending}
            color="blue"
          >
            Sí, enviar
          </Button>
          <Button
            color="red"
            onClick={() => setOpenModal(false)}
            className="w-auto"
            disabled={isSending}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWipe} onClose={() => setShowWipe(false)} size="md">
        <Modal.Header>Confirmar eliminación</Modal.Header>
        <Modal.Body>
          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro de que deseas vaciar la lista? Este proceso es
            irreversible
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => handleWipe()}>
            Sí, eliminar
          </Button>
          <Button color="blue" onClick={() => setShowWipe(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <Modal.Header>Confirmar eliminación</Modal.Header>
        <Modal.Body>
          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro de que deseas eliminar este registro?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => handleDelete(recordToDelete)}>
            Sí, eliminar
          </Button>
          <Button color="blue" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {showToast && (
        <div className="fixed bottom-4 right-4">
          <Toast>
            {toastIcon}
            <div className="pl-4 text-sm font-normal">{toastMessage}</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        </div>
      )}

      <div>
        <Footer container className="mt-10">
          <Footer.Copyright by="Pedro Moccó" year={2025} />
        </Footer>
      </div>

      <Banner>
        <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 mt-4">
          <div className="mx-auto flex items-center">
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <FaTelegramPlane className="h-5 w-5 mr-2" />
              <span className="[&_p]:inline">
                Suscribete al bot de Telegram para comenzar a recibir tus reportes&nbsp;
                <a
                  href="https://web.telegram.org/k/#@pdfgram_demo_bot"
                  target="_blank" rel="noopener noreferrer"
                  className="inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-cyan-500"
                >
                  aquí
                </a>
              </span>
            </p>
          </div>
          <Banner.CollapseButton
            color="gray"
            className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
          >
            <HiX className="h-4 w-4" />
          </Banner.CollapseButton>
        </div>
      </Banner>
    </div>
  );
}
