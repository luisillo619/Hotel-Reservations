export default async function handlerRoomId(req, res) {
    // El params de node y express ahora se va a llamar query
    try {
      switch (req.method) {
        case "GET": {
          return await getRoom(req, res);
        }
        case "DELETE": {
          return await deleteRoom(req, res);
        }
        case "PUT": {
          return await updateRoom(req, res);
        }
        default:
          return res.status(405).json({ message: "Método no permitido" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  }
  
  const getRoom = async (req, res) => {
    console.log(req.query)
  };
  const deleteRoom = async (req, res) => {};
  const updateRoom = async (req, res) => {};