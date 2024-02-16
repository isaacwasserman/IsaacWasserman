#version 300 es
#ifdef GL_ES
    precision highp float;
#endif

out vec4 frag_color;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.14159265359;

struct Cube {
    vec3 translation;
    vec3 scale;
    vec3 rotation;
};

struct Camera {
    vec3 position;
    vec3 target;
    vec3 up;
    float fov;
    float near;
    float far;
    float aspect;
};

struct Ray {
    Camera camera;
    vec3 origin;
    vec3 direction;
};

struct Intersection {
    Ray ray;
    float distance;
};

mat4 model_matrix(Cube cube) {
    mat4 translation_matrix = mat4(
        vec4(1, 0, 0, 0),
        vec4(0, 1, 0, 0),
        vec4(0, 0, 1, 0),
        vec4(cube.translation, 1)
    );

    mat4 scale_matrix = mat4(
        vec4(cube.scale.x, 0, 0, 0),
        vec4(0, cube.scale.y, 0, 0),
        vec4(0, 0, cube.scale.z, 0),
        vec4(0, 0, 0, 1)
    );

    mat4 rotation_matrix_x = mat4(
        vec4(1, 0, 0, 0),
        vec4(0, cos(cube.rotation.x), -sin(cube.rotation.x), 0),
        vec4(0, sin(cube.rotation.x), cos(cube.rotation.x), 0),
        vec4(0, 0, 0, 1)
    );

    mat4 rotation_matrix_y = mat4(
        vec4(cos(cube.rotation.y), 0, sin(cube.rotation.y), 0),
        vec4(0, 1, 0, 0),
        vec4(-sin(cube.rotation.y), 0, cos(cube.rotation.y), 0),
        vec4(0, 0, 0, 1)
    );

    mat4 rotation_matrix_z = mat4(
        vec4(cos(cube.rotation.z), -sin(cube.rotation.z), 0, 0),
        vec4(sin(cube.rotation.z), cos(cube.rotation.z), 0, 0),
        vec4(0, 0, 1, 0),
        vec4(0, 0, 0, 1)
    );

    return translation_matrix * rotation_matrix_x * rotation_matrix_y * rotation_matrix_z * scale_matrix;
}

mat4 view_matrix(Camera camera) {
    vec3 zAxis = normalize(camera.position - camera.target);
    vec3 xAxis = normalize(cross(camera.up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));

    mat4 matrix = mat4(
        vec4(xAxis, 0),
        vec4(yAxis, 0),
        vec4(zAxis, 0),
        vec4(0, 0, 0, 1)
    );
 
    return matrix;
}

mat4 projection_matrix(Camera camera) {
    float f = 1.0 / tan(radians(camera.fov) / 2.0);
    float aspect = camera.aspect;
    float near = camera.near;
    float far = camera.far;

    mat4 matrix = mat4(
        vec4(f / aspect, 0, 0, 0),
        vec4(0, f, 0, 0),
        vec4(0, 0, (far + near) / (near - far), -1),
        vec4(0, 0, (2.0 * far * near) / (near - far), 0)
    );

    return matrix;
}

mat4 view_projection_matrix(Camera camera) {
    return projection_matrix(camera) * view_matrix(camera);
}

mat4 inverse_view_projection_matrix(Camera camera) {
    return inverse(view_projection_matrix(camera));
}

bool intersect_cube(Ray ray, Cube cube, out Intersection intersection) {
    // Bring the ray into the cube's local space
    vec3 ray_origin = (inverse(model_matrix(cube)) * vec4(ray.origin, 1)).xyz;
    vec3 ray_direction = (inverse(model_matrix(cube)) * vec4(ray.direction, 0)).xyz;

    // Ray-box intersection
    vec3 t_min = (cube.translation - ray_origin) / ray_direction;
    vec3 t_max = (cube.translation + cube.scale - ray_origin) / ray_direction;

    vec3 t1 = min(t_min, t_max);
    vec3 t2 = max(t_min, t_max);

    float t_near = max(max(t1.x, t1.y), t1.z);
    float t_far = min(min(t2.x, t2.y), t2.z);

    if (t_near > t_far || t_far < 0.0) {
        return false;
    }

    intersection.distance = t_near;
    intersection.ray = ray;

    return true;
}

bool intersect_scene(Ray ray, Cube[1] cubes, out Intersection closest_intersection) {
    float min_t = 1000000.0;
    Intersection intersection;
    for (int i = 0; i < 1; i++) {
        if (intersect_cube(ray, cubes[i], intersection)) {
            if (intersection.distance < min_t) {
                min_t = intersection.distance;
                closest_intersection = intersection;
            }
        }
    }
    if (min_t < 1000000.0) {
        return true;
    }
    else {
        return false;
    }
}

Ray cast_ray(Camera camera, vec2 clipspace_coords) {
    vec4 clip_space_position = vec4(clipspace_coords.x, clipspace_coords.y, -1.0, 1.0);
    vec4 world_space_position_vec4 = inverse_view_projection_matrix(camera) * clip_space_position;
    vec3 world_space_position = world_space_position_vec4.xyz / world_space_position_vec4.w;
    vec3 ray_direction = normalize(world_space_position - camera.position.xyz);
    Ray ray = Ray(camera, camera.position, ray_direction);
    return ray;
}

void main() {
    vec2 screenspace_coords = gl_FragCoord.xy;
    vec2 clipspace_coords = vec2((2.0 * screenspace_coords.x) / u_resolution.x - 1.0, 1.0 - (2.0 * screenspace_coords.y) / u_resolution.y);

    Camera camera = Camera(vec3(0, 0, 10), vec3(0, 0, 0), vec3(0, 1, 0), 45.0, 0.1, 1000.0, u_resolution.x / u_resolution.y);
    Cube cubes[1];
    cubes[0] = Cube(vec3(0, 0, -10), vec3(1,1,1), vec3(0,0,0));

    Ray ray = cast_ray(camera, clipspace_coords);

    Intersection intersection;
    bool hit = intersect_scene(ray, cubes, intersection);
    if (hit) {
        frag_color = vec4(1.0, 0.0, 0.0, 1.0);
    } else {
        frag_color = vec4(0.0, 0.0, 0.0, 1.0);
    }
    // Vector3f color;
    // if (hit_object) {
    //     color = ((intersection.normal + Vector3f(1, 1, 1)) * 0.5f) * 255.0f;
    // } else {
    //     color = Vector3f(0, 0, 0);
    // }
    // screen[(y * screen_width + x) * 3] = (uchar)color.x;
    // screen[(y * screen_width + x) * 3 + 1] = (uchar)color.y;
    // screen[(y * screen_width + x) * 3 + 2] = (uchar)color.z;
}