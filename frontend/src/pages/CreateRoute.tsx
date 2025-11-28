import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import RoleGuard from '@/components/RoleGuard';
import { Ruta } from '@/utils/localStorage';
import { mapRutaToBackendRequest } from '@/utils/backendMapper';
import { rutaService } from '@/services/rutaService';
import { ROLES } from '@/utils/roleValidation';
import { useToast } from '@/hooks/use-toast';

const CreateRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Ruta>>({
    distanciaTotal: 0,
    tiempoPromedio: 0,
    traficoPromedio: '',
    prioridad: '',
    estadoRuta: 'Pendiente',
  });

  const [vehiculoPlaca, setVehiculoPlaca] = useState('');
  const [conductorCedula, setConductorCedula] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estadosMapInverso, setEstadosMapInverso] = useState<Map<string, number>>(new Map());
  const [traficoMapInverso, setTraficoMapInverso] = useState<Map<string, number>>(new Map());
  const [prioridadMapInverso, setPrioridadMapInverso] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Obtener estados para mapeo
      const estados = await rutaService.getEstados();
      const estadosMapInversoLocal = new Map(estados.map(e => [e.nombreEstado, e.idEstado]));
      setEstadosMapInverso(estadosMapInversoLocal);
      
      // Mapeos de tráfico y prioridad
      const traficoMapInv = new Map([
        ['Bajo', 1],
        ['Moderado', 2],
        ['Alto', 3],
        ['Muy Alto', 4],
      ]);
      setTraficoMapInverso(traficoMapInv);
      
      const prioridadMapInv = new Map([
        ['Baja', 1],
        ['Media', 2],
        ['Alta', 3],
      ]);
      setPrioridadMapInverso(prioridadMapInv);
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar datos';
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Error al cargar los datos necesarios",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.traficoPromedio || !formData.prioridad || !formData.estadoRuta) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    if (!formData.distanciaTotal || formData.distanciaTotal <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La distancia total debe ser mayor a 0",
      });
      return;
    }

    if (!formData.tiempoPromedio || formData.tiempoPromedio <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El tiempo promedio debe ser mayor a 0",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Preparar datos para el backend
      const rutaParaBackend = {
        ...formData,
        vehiculoAsignado: vehiculoPlaca ? { placaVehiculo: vehiculoPlaca } : undefined,
        conductorAsignado: conductorCedula 
          ? { 
              cedula: conductorCedula,
              nombre: ''
            } 
          : undefined,
      };
      
      // Convertir a formato del backend
      const rutaRequest = mapRutaToBackendRequest(
        rutaParaBackend,
        estadosMapInverso,
        traficoMapInverso,
        prioridadMapInverso
      );
      
      // Crear ruta en el backend
      const rutaCreada = await rutaService.create(rutaRequest);
      
      toast({
        title: "¡Ruta creada!",
        description: `La ruta ha sido registrada exitosamente`,
      });
      
      navigate('/view-routes');
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al crear la ruta';
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Error al crear la ruta",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Ruta, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <RoleGuard rolesPermitidos={[ROLES.GESTOR]}>
        <div className="min-h-screen bg-secondary/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando datos...</span>
            </div>
          </main>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard rolesPermitidos={[ROLES.GESTOR]}>
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <Card className="max-w-3xl mx-auto shadow-medium">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Crear Nueva Ruta</CardTitle>
              <CardDescription>
                Completa la información para registrar una nueva ruta en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <Label htmlFor="estadoRuta">Estado *</Label>
                    <Select 
                      value={formData.estadoRuta} 
                      onValueChange={(value) => handleChange('estadoRuta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(estadosMapInverso.keys()).map(estado => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distancia">Distancia Total (km) *</Label>
                    <Input
                      id="distancia"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.distanciaTotal}
                      onChange={(e) => handleChange('distanciaTotal', parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiempo">Tiempo Promedio (min) *</Label>
                    <Input
                      id="tiempo"
                      type="number"
                      min="0"
                      value={formData.tiempoPromedio}
                      onChange={(e) => handleChange('tiempoPromedio', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trafico">Tráfico Promedio *</Label>
                    <Select 
                      value={formData.traficoPromedio} 
                      onValueChange={(value) => handleChange('traficoPromedio', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bajo">Bajo</SelectItem>
                        <SelectItem value="Moderado">Moderado</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                        <SelectItem value="Muy Alto">Muy Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad *</Label>
                    <Select 
                      value={formData.prioridad} 
                      onValueChange={(value) => handleChange('prioridad', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Placa del Vehículo</Label>
                    <Input
                      id="vehiculo"
                      type="text"
                      placeholder="ABC123"
                      value={vehiculoPlaca}
                      onChange={(e) => setVehiculoPlaca(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conductor">Conductor Asignado (Cédula)</Label>
                    <Input
                      id="conductor"
                      type="text"
                      placeholder="Cédula del conductor"
                      value={conductorCedula}
                      onChange={(e) => setConductorCedula(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-accent hover:bg-accent/90 text-white"
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Creando...' : 'Crear Ruta'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/view-routes')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </RoleGuard>
  );
};

export default CreateRoute;
