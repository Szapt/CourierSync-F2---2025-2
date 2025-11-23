import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Route, Users, BarChart3, Plus, Eye, Edit, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { getUsuarioActivo, Ruta } from '@/utils/localStorage';
import { esGestor, esAuditor, esConductor, esAdmin } from '@/utils/roleValidation';
import { rutaService } from '@/services/rutaService';
import { mapRutaBackendToFrontend } from '@/utils/backendMapper';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const usuario = getUsuarioActivo();
  const navigate = useNavigate();
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadosMap, setEstadosMap] = useState<Map<number, string>>(new Map());
  const { toast } = useToast();

  // Estados para modales
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRutaId, setSelectedRutaId] = useState('');
  const [rutaToUpdate, setRutaToUpdate] = useState<Ruta | null>(null);
  const [rutaToDelete, setRutaToDelete] = useState<Ruta | null>(null);
  const [formData, setFormData] = useState({
    distanciaTotal: 0,
    tiempoPromedio: 0,
    traficoPromedio: '',
    prioridad: '',
    estadoRuta: '',
    vehiculoPlaca: '',
    conductorCedula: '',
  });

  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      setLoading(true);
      
      // Obtener estados para mapeo
      const estados = await rutaService.getEstados();
      const estadosMapLocal = new Map(estados.map(e => [e.idEstado, e.nombreEstado]));
      setEstadosMap(estadosMapLocal);
      
      // Obtener rutas
      let rutasBackend = await rutaService.getAll();
      
      // Convertir a formato frontend
      let rutasFrontend = rutasBackend.map(r => mapRutaBackendToFrontend(r, estadosMapLocal));
      
      // Si es conductor, filtrar por su cédula
      if (esConductor() && usuario) {
        rutasFrontend = rutasFrontend.filter(r => 
          r.conductorAsignado?.cedula === usuario.cedula
        );
      }
      
      setRutas(rutasFrontend);
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar rutas';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'Error al cargar las rutas',
      });
    } finally {
      setLoading(false);
    }
  };

  // Rutas activas incluyen "Activa" y "EN_TRÁNSITO" (o "En Proceso")
  const rutasActivas = rutas.filter(r => 
    r.estadoRuta === 'Activa' || 
    r.estadoRuta === 'EN_TRÁNSITO' || 
    r.estadoRuta === 'En Tránsito' ||
    r.estadoRuta === 'En Proceso'
  ).length;
  const rutasCompletadas = rutas.filter(r => r.estadoRuta === 'Completada').length;

  // Buscar ruta para actualizar y redirigir a editar
  const handleSearchUpdate = () => {
    const ruta = rutas.find(r => r.idRuta === selectedRutaId);
    if (ruta) {
      // Redirigir a la página de edición
      navigate(`/edit-route/${ruta.idRuta}`);
      setOpenUpdateModal(false);
      setSelectedRutaId('');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ruta no encontrada",
      });
    }
  };

  // Buscar ruta para eliminar
  const handleSearchDelete = () => {
    const ruta = rutas.find(r => r.idRuta === selectedRutaId);
    if (ruta) {
      setRutaToDelete(ruta);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ruta no encontrada",
      });
    }
  };

  // Eliminar ruta
  const handleDelete = async () => {
    if (!rutaToDelete) return;

    try {
      // Extraer ID numérico del formato "RUTA_001"
      const match = rutaToDelete.idRuta.match(/RUTA_(\d+)/);
      if (!match) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'ID de ruta inválido',
        });
        return;
      }
      
      const idNumero = parseInt(match[1], 10);
      await rutaService.delete(idNumero);
      
      toast({
        title: "Éxito",
        description: "Ruta eliminada correctamente",
      });
      
      setOpenDeleteModal(false);
      setRutaToDelete(null);
      setSelectedRutaId('');
      
      // Recargar rutas
      await loadRutas();
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al eliminar ruta';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'Error al eliminar la ruta',
      });
    }
  };

  const menuItems = [
    {
      icon: Route,
      title: 'Ver Rutas',
      description: 'Consulta todas las rutas registradas',
      link: '/view-routes',
      color: 'bg-blue-500',
      visible: true, // Todos los roles pueden ver rutas
      action: null,
    },
    {
      icon: Plus,
      title: 'Crear Ruta',
      description: 'Registra una nueva ruta',
      link: '/create-route',
      color: 'bg-green-500',
      visible: esGestor() || esAdmin(), // Admin y Gestor pueden crear
      action: null,
    },
    {
      icon: Edit,
      title: 'Actualizar Ruta',
      description: 'Edita los datos de una ruta registrada',
      link: null,
      color: 'bg-orange-500',
      visible: esGestor() || esAdmin(), // Admin y Gestor pueden actualizar
      action: () => setOpenUpdateModal(true),
    },
    {
      icon: Trash2,
      title: 'Eliminar Ruta',
      description: 'Elimina rutas registradas del sistema',
      link: null,
      color: 'bg-red-500',
      visible: esGestor() || esAdmin(), // Admin y Gestor pueden eliminar
      action: () => setOpenDeleteModal(true),
    },
    {
      icon: Users,
      title: 'Equipo',
      description: 'Gestiona conductores y personal',
      link: '/team',
      color: 'bg-purple-500',
      visible: !esConductor(), // Todos excepto Conductor
      action: null,
    },
    {
      icon: BarChart3,
      title: 'Análisis',
      description: 'Visualiza estadísticas y métricas',
      link: '/analysis',
      color: 'bg-orange-500',
      visible: !esConductor(), // Todos excepto Conductor
      action: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando dashboard...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Bienvenido, {usuario?.nombre || 'Usuario'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {esAdmin() && 'Administra el sistema completo, gestiona rutas y usuarios'}
            {esGestor() && !esAdmin() && 'Gestiona rutas, asigna recursos y controla operaciones'}
            {esAuditor() && 'Supervisa y audita las operaciones del sistema'}
            {esConductor() && 'Consulta tus rutas asignadas y reporta el progreso'}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardDescription>Total de Rutas</CardDescription>
              <CardTitle className="text-4xl text-primary">{rutas.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Rutas Activas</CardDescription>
              <CardTitle className="text-4xl text-green-600">{rutasActivas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Completadas</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{rutasCompletadas}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Menú de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.filter(item => item.visible).map((item, index) => (
            <Card 
              key={index} 
              className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={item.action || undefined}
            >
              {item.link ? (
                <Link to={item.link}>
                  <CardHeader>
                    <div className={`${item.color} text-white rounded-full p-4 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
              ) : (
                <CardHeader>
                  <div className={`${item.color} text-white rounded-full p-4 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              )}
            </Card>
          ))}
        </div>
      </main>

      {/* Modal Actualizar Ruta */}
      <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Actualizar Ruta
            </DialogTitle>
            <DialogDescription>
              Busca la ruta que deseas editar por su ID.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-update">ID de Ruta</Label>
              <div className="flex gap-2">
                <Input
                  id="search-update"
                  placeholder="Ej: RUTA_001"
                  value={selectedRutaId}
                  onChange={(e) => setSelectedRutaId(e.target.value.toUpperCase())}
                />
                <Button onClick={handleSearchUpdate} className="bg-primary hover:bg-primary/90">
                  Buscar y Editar
                </Button>
              </div>
            </div>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Ingresa el ID de la ruta que deseas actualizar. Serás redirigido a la página de edición.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setOpenUpdateModal(false);
                setSelectedRutaId('');
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar Ruta */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-destructive text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Eliminar Ruta
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Busca la ruta que deseas eliminar.
            </DialogDescription>
          </DialogHeader>

          {!rutaToDelete ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="search-delete">ID de Ruta</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-delete"
                    placeholder="Ej: RUTA_001"
                    value={selectedRutaId}
                    onChange={(e) => setSelectedRutaId(e.target.value.toUpperCase())}
                  />
                  <Button onClick={handleSearchDelete} className="bg-primary hover:bg-primary/90">
                    Buscar
                  </Button>
                </div>
              </div>
              
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ⚠️ Ingresa el ID de la ruta que deseas eliminar permanentemente
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded space-y-2">
                <p className="font-semibold text-destructive text-lg">
                  ¿Estás seguro de eliminar esta ruta?
                </p>
                <div className="text-sm space-y-1 text-foreground">
                  <p><span className="font-medium">ID:</span> {rutaToDelete.idRuta}</p>
                  <p><span className="font-medium">Distancia:</span> {rutaToDelete.distanciaTotal} km</p>
                  <p><span className="font-medium">Estado:</span> {rutaToDelete.estadoRuta}</p>
                  <p><span className="font-medium">Prioridad:</span> {rutaToDelete.prioridad}</p>
                  {rutaToDelete.conductorAsignado && (
                    <p><span className="font-medium">Conductor:</span> {rutaToDelete.conductorAsignado.nombre}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setOpenDeleteModal(false);
                setRutaToDelete(null);
                setSelectedRutaId('');
              }}
            >
              Cancelar
            </Button>
            {rutaToDelete && (
              <Button 
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Definitivamente
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
