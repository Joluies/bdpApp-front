import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  Input,
  Dropdown,
  Grid,
  Card,
  Spacer,
  Loading,
} from "@nextui-org/react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import { ProductsTable } from "./products-table";
import { productsData, ProductLocal, mapApiProductToLocal } from "./data";
import { AddProductModal } from "./add-product-modal";
import {
  productsApiService,
  ApiProduct,
} from "../../services/products-api.service";
import { APIStatus } from "./api-status";

export const ProductsContent = () => {
  const [products, setProducts] = useState<ProductLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  // Cargar productos de la API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    console.log("🔄 Iniciando carga de productos...");

    try {
      console.log("🌐 Intentando conectar a la API...");
      const apiProducts = await productsApiService.getProducts();

      console.log("📊 Productos recibidos de la API:", apiProducts);

      // Si llegamos aquí, la API respondió exitosamente
      console.log("✅ API conectada exitosamente");
      setApiConnected(true);
      setLastUpdated(new Date());

      if (apiProducts && apiProducts.length > 0) {
        console.log("📦 Productos encontrados:", apiProducts.length);
        // Convertir productos de API al formato local
        const localProducts = apiProducts.map(mapApiProductToLocal);
        setProducts(localProducts);
      } else {
        console.log("📭 API conectada pero sin productos disponibles");
        // API conectada pero sin productos - mostrar array vacío
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Error conectando a la API:", error);
      console.log("📁 Usando datos locales como fallback");
      setProducts(productsData);
      setApiConnected(false);
    } finally {
      setLoading(false);
      console.log("🏁 Carga de productos completada");
    }
  };

  // Filtrar productos basado en búsqueda y estado
  const filteredProducts = products.filter((product) => {
    // Validar que el producto tenga las propiedades necesarias
    if (!product || !product.name) {
      console.warn("⚠️ Producto sin propiedades requeridas:", product);
      return false;
    }

    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchValue.toLowerCase()) ||
      (product.description || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      (product.category || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || product.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Estadísticas rápidas
  const stats = {
    total: products.length,
    disponibles: products.filter((p) => p.status === "Disponible").length,
    agotados: products.filter((p) => p.status === "Agotado").length,
    valorTotal: products.reduce(
      (sum, p) => sum + p.precio_unitario * (p.stockTotal || 0),
      0
    ),
  };

  // Función para agregar un nuevo producto
  const handleAddProduct = async (newProductData: Omit<ProductLocal, "id">) => {
    console.log("🚀 El modal ya creó el producto en la API, recargando lista...", newProductData);

    try {
      // El modal ya envió el producto a la API con createProductWithImage
      // Solo necesitamos recargar la lista de productos desde la API
      console.log("🔄 Recargando productos desde la API...");
      await loadProducts();
      console.log("✅ Productos recargados exitosamente");
    } catch (error) {
      console.error("❌ Error al recargar productos:", error);
      // Fallback: agregar el producto localmente con un ID temporal
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      const localProduct: ProductLocal = {
        ...newProductData,
        id: newId,
      };
      setProducts((prev) => [...prev, localProduct]);
    }
  };

  // Función para actualizar un producto
  const handleUpdateProduct = async (
    id: number,
    updatedData: Partial<ProductLocal> & { imageFile?: File | null }
  ) => {
    try {
      console.log("📝 Iniciando actualización de producto:", {
        id,
        updatedData,
        hasImageFile: !!updatedData.imageFile
      });

      // Preparar datos sin el archivo para ambos casos
      const dataWithoutFile = { ...updatedData };
      delete dataWithoutFile.imageFile;

      // Si hay un archivo de imagen NUEVO (no solo URL), usar el método con FormData
      if (updatedData.imageFile && updatedData.imageFile instanceof File) {
        console.log("📸 Detectada imagen nueva para actualizar");
        
        // Preparar datos para la API
        const apiUpdateData = {
          nombre: dataWithoutFile?.name ?? "",
          descripcion: dataWithoutFile?.description ?? "",
          presentacion: dataWithoutFile?.presentation ?? "",
          precioUnitario: dataWithoutFile?.precio_unitario ?? 0,
          precioMayorista: dataWithoutFile?.precio_mayorista ?? 0,
          stockPaquete: dataWithoutFile?.stockPaquete ?? 0,
          stockUnid: dataWithoutFile?.stockUnid ?? 15
        };
        
        console.log("📊 Datos a enviar al API con imagen:", apiUpdateData);
        console.log("📸 Archivo: " + updatedData.imageFile.name + " (" + updatedData.imageFile.size + " bytes)");

        // 🔥 LLAMADA AL API CON IMAGEN
        const updatedProduct = await productsApiService.updateProductWithImage(
          id,
          apiUpdateData,
          updatedData.imageFile
        );

        if (updatedProduct) {
          console.log("✅ Producto actualizado con imagen en la API");
          const localProduct = mapApiProductToLocal(updatedProduct);
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? localProduct : p))
          );
        }
      } else {
        // Sin imagen nueva o imagen es null, usar método estándar
        console.log("📝 Actualización sin imagen nueva, usando método estándar");

        // Convertir datos locales al formato de la API
        const apiUpdateData = productsApiService.mapToApi(dataWithoutFile);
        console.log("📊 Datos a enviar al API sin imagen:", apiUpdateData);

        const updatedProduct = await productsApiService.updateProduct(
          id,
          apiUpdateData
        );

        if (updatedProduct) {
          console.log("✅ Producto actualizado en la API");
          const localProduct = mapApiProductToLocal(updatedProduct);
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? localProduct : p))
          );
        }
      }
      
      // Recargar productos desde API para asegurar sincronización
      console.log("🔄 Recargando productos desde API para sincronización...");
      await loadProducts();
      
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      // Intentar recargar desde API como fallback
      try {
        await loadProducts();
      } catch (e) {
        console.error("❌ Error al recargar productos:", e);
      }
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id: number) => {
    try {
      const success = await productsApiService.deleteProduct(id);

      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        // Si falla la API, eliminar localmente como fallback
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      // Fallback a eliminar localmente
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <Box css={{ overflow: "hidden", height: "100%" }}>
      {/* Header */}
      <Flex
        css={{
          gap: "$8",
          pt: "$5",
          height: "fit-content",
          flexWrap: "wrap",
          "@sm": {
            pt: "$10",
          },
        }}
        justify={"center"}
      >
        <Flex
          css={{
            px: "$12",
            mt: "$8",
            "@xsMax": { px: "$10" },
            gap: "$12",
            width: "100%",
          }}
          direction={"column"}
        >
          {/* Título y botón agregar */}
          <Flex justify="between" align="center">
            <Box>
              <Text
                h1
                css={{
                  textAlign: "center",
                  color: '#1e40af',
                  fontSize: "$3xl",
                  fontWeight: "bold",
                  "@sm": {
                    textAlign: "inherit",
                  },
                }}
              >
                📦 Productos - Bebidas Gaseosas
              </Text>
              <Text
                css={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "$lg",
                  "@sm": {
                    textAlign: "inherit",
                  },
                }}
              >
                Gestiona el inventario de bebidas de Bebidas del Perú
              </Text>

              <APIStatus
                isConnected={apiConnected}
                isLoading={loading}
                lastUpdated={lastUpdated}
                productsCount={products.length}
              />
            </Box>

            <Flex css={{ gap: "$4" }}>
              <Button
                auto
                flat
                onClick={loadProducts}
                disabled={loading}
                css={{
                  backgroundColor: "rgba(30, 64, 175, 0.1)",
                  color: "#1e40af",
                  border: "2px solid #1e40af",
                  fontWeight: 'bold',
                  "&:hover": {
                    backgroundColor: "rgba(30, 64, 175, 0.2)",
                  },
                }}
              >
                🔄 Recargar
              </Button>

              <Button
                auto
                flat
                onClick={async () => {
                  console.log("🧪 Probando API directamente...");
                  try {
                    const testProduct = {
                      nombre: "Producto Test API",
                      descripcion: "Test desde frontend",
                      presentacion: "Test 500ml",
                      precioUnitario: 10.5,
                      precioMayorista: 9.5,
                      stock: 50,
                      urlImage:
                        "https://via.placeholder.com/150x150.png?text=Test+API",
                    };
                    const result = await productsApiService.createProduct(
                      testProduct
                    );
                    console.log("🎯 Resultado de prueba API:", result);
                    if (result) {
                      await loadProducts();
                    }
                  } catch (error) {
                    console.error("💥 Error en prueba API:", error);
                  }
                }}
                css={{
                  backgroundColor: "#FFA500",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#FF8C00",
                  },
                }}
              >
                🧪 Test API
              </Button>

              <Button
                auto
                onClick={() => setShowAddModal(true)}
                css={{
                  backgroundColor: "#5CAC4C",
                  color: "white",
                  fontWeight: "$semibold",
                  "&:hover": {
                    backgroundColor: "#4A9C3C",
                  },
                }}
              >
                + Agregar Producto
              </Button>
            </Flex>
          </Flex>

          {/* Estadísticas rápidas */}
          <Grid.Container gap={2} justify="flex-start">
            <Grid xs={12} sm={3}>
              <Card css={{ backgroundColor: "#F1F1E9", p: "$6" }}>
                <Text
                  css={{
                    color: "#034F32",
                    fontSize: "$sm",
                    fontWeight: "$medium",
                  }}
                >
                  Total Productos
                </Text>
                <Text
                  css={{
                    color: "#5CAC4C",
                    fontSize: "$2xl",
                    fontWeight: "$bold",
                  }}
                >
                  {stats.total}
                </Text>
              </Card>
            </Grid>
            <Grid xs={12} sm={3}>
              <Card css={{ backgroundColor: "#C8ECC9", p: "$6" }}>
                <Text
                  css={{
                    color: "#034F32",
                    fontSize: "$sm",
                    fontWeight: "$medium",
                  }}
                >
                  Disponibles
                </Text>
                <Text
                  css={{
                    color: "#034F32",
                    fontSize: "$2xl",
                    fontWeight: "$bold",
                  }}
                >
                  {stats.disponibles}
                </Text>
              </Card>
            </Grid>
            <Grid xs={12} sm={3}>
              <Card css={{ backgroundColor: "#F8D7DA", p: "$6" }}>
                <Text
                  css={{
                    color: "#721C24",
                    fontSize: "$sm",
                    fontWeight: "$medium",
                  }}
                >
                  Agotados
                </Text>
                <Text
                  css={{
                    color: "#721C24",
                    fontSize: "$2xl",
                    fontWeight: "$bold",
                  }}
                >
                  {stats.agotados}
                </Text>
              </Card>
            </Grid>
            <Grid xs={12} sm={3}>
              <Card css={{ backgroundColor: "#034F32", p: "$6" }}>
                <Text
                  css={{
                    color: "white",
                    fontSize: "$sm",
                    fontWeight: "$medium",
                  }}
                >
                  Valor Total Inventario
                </Text>
                <Text
                  css={{
                    color: "#C8ECC9",
                    fontSize: "$xl",
                    fontWeight: "$bold",
                  }}
                >
                  S/ {stats.valorTotal.toFixed(2)}
                </Text>
              </Card>
            </Grid>
          </Grid.Container>

          {/* Filtros y búsqueda */}
          <Flex
            css={{
              gap: "$8",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <Box css={{ flex: 1, minWidth: "200px" }}>
              <Input
                clearable
                placeholder="Buscar productos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                css={{
                  "& .nextui-input": {
                    borderColor: "#C8ECC9",
                  },
                  "& .nextui-input:focus": {
                    borderColor: "#5CAC4C",
                  },
                }}
              />
            </Box>

            <Dropdown>
              <Dropdown.Button
                auto
                css={{
                  backgroundColor: "#F1F1E9",
                  color: "#034F32",
                  border: "1px solid #C8ECC9",
                  "&:hover": {
                    backgroundColor: "#C8ECC9",
                  },
                }}
              >
                Estado: {filterStatus === "todos" ? "Todos" : filterStatus}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Filtrar por estado"
                onAction={(key) => setFilterStatus(String(key))}
              >
                <Dropdown.Item key="todos">Todos</Dropdown.Item>
                <Dropdown.Item key="Disponible">Disponible</Dropdown.Item>
                <Dropdown.Item key="Agotado">Agotado</Dropdown.Item>
                <Dropdown.Item key="Descontinuado">Descontinuado</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Flex>

          <Spacer y={1} />

          {/* Tabla de productos */}
          <Box>
            {loading ? (
              <Flex
                justify="center"
                align="center"
                css={{ minHeight: "400px" }}
              >
                <Loading size="xl" color="success">
                  Cargando productos desde la API...
                </Loading>
              </Flex>
            ) : (
              <ProductsTable
                products={filteredProducts}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Modal para agregar producto */}
      <AddProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProduct={handleAddProduct}
      />
    </Box>
  );
};
