import  { Router} from 'express'
import { authMiddleware, isOrganizer } from '../middleware/authmiddleware.ts';
import { createEvent, deleteEvent, organizerAllEvents, updateEvent } from '../controller/organizers.ts';


const organizerRoutes = Router();
organizerRoutes.use(authMiddleware, isOrganizer);


organizerRoutes.post("/create-event", createEvent  );
organizerRoutes.post("/update-event", updateEvent );
organizerRoutes.delete("/update-event", deleteEvent );
organizerRoutes.get("/organizer-all-events", organizerAllEvents );





export default organizerRoutes