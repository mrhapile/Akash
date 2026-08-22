#!/usr/bin/env python3
"""Generate the deterministic ink-splash sprite used by the page loader."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


FRAME_COUNT = 24
FRAME_SIZE = 512
SEED = 7319
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "public/hero/ink-splash-sprite.png"
REVEAL_OUTPUT_PATH = Path(__file__).resolve().parents[1] / "public/hero/ink-splash-reveal-sprite.png"


def smooth_noise(rng: np.random.Generator, grid_size: int) -> np.ndarray:
    grid = rng.random((grid_size, grid_size), dtype=np.float32)
    image = Image.fromarray(np.uint8(grid * 255), mode="L")
    image = image.resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.BICUBIC)
    return np.asarray(image, dtype=np.float32) / 255.0


def build_arrival_field() -> np.ndarray:
    rng = np.random.default_rng(SEED)
    axis = np.linspace(-1.0, 1.0, FRAME_SIZE, dtype=np.float32)
    x, y = np.meshgrid(axis, axis)
    radius = np.sqrt(x * x + y * y)
    angle = np.arctan2(y, x)

    noise = np.zeros_like(radius)
    for grid_size, weight in ((4, 0.48), (8, 0.27), (16, 0.16), (32, 0.09)):
        noise += (smooth_noise(rng, grid_size) - 0.5) * weight

    directional_warp = (
        0.10 * np.sin(angle * 5.0 + 0.8)
        + 0.055 * np.sin(angle * 9.0 - 1.7)
        + 0.025 * np.sin(angle * 17.0 + 0.35)
    )
    arrival = radius / np.clip(1.0 + noise * 0.9 + directional_warp, 0.58, 1.48)

    # Add long, narrow channels that behave like liquid tendrils.
    for _ in range(24):
        theta = rng.uniform(0.0, np.pi * 2.0)
        length = rng.uniform(0.42, 1.24)
        width = rng.uniform(0.012, 0.042)
        bend = rng.uniform(-0.34, 0.34)
        start_delay = rng.uniform(0.05, 0.24)

        cos_theta = np.cos(theta)
        sin_theta = np.sin(theta)
        along = x * cos_theta + y * sin_theta
        across = -x * sin_theta + y * cos_theta
        curved_across = across - bend * np.square(np.clip(along, 0.0, length))
        segment = np.clip(along / length, 0.0, 1.0)
        distance = np.sqrt(
            np.square(curved_across)
            + np.square(np.minimum(along, 0.0))
            + np.square(np.maximum(along - length, 0.0))
        )
        tendril_arrival = start_delay + segment * 0.58 + distance / width * 0.035
        arrival = np.minimum(arrival, tendril_arrival)

    # Independent droplets appear around the growing blot and later merge into it.
    for _ in range(38):
        theta = rng.uniform(0.0, np.pi * 2.0)
        distance_from_center = rng.uniform(0.18, 1.02)
        cx = np.cos(theta) * distance_from_center
        cy = np.sin(theta) * distance_from_center
        drop_radius = rng.uniform(0.014, 0.065)
        drop_distance = np.sqrt(np.square(x - cx) + np.square(y - cy))
        drop_start = 0.10 + distance_from_center * 0.52 + rng.uniform(-0.05, 0.08)
        drop_arrival = drop_start + np.maximum(drop_distance - drop_radius, 0.0) * 2.8
        arrival = np.minimum(arrival, drop_arrival)

    edge_grain = smooth_noise(rng, 64) - 0.5
    arrival += edge_grain * 0.035
    arrival -= np.nanmin(arrival)
    arrival /= max(float(np.nanmax(arrival)), 1e-6)
    return arrival


def render_frame(arrival: np.ndarray, progress: float, final: bool) -> Image.Image:
    if final:
        alpha = np.full((FRAME_SIZE, FRAME_SIZE), 255, dtype=np.uint8)
    else:
        feather = 0.018
        alpha_float = np.clip((progress + feather - arrival) / (feather * 2.0), 0.0, 1.0)
        alpha = np.uint8(np.power(alpha_float, 0.78) * 255)

        # A faint wet fringe softens only the boundary, leaving the ink body dense.
        alpha_image = Image.fromarray(alpha, mode="L")
        fringe = alpha_image.filter(ImageFilter.GaussianBlur(radius=1.1))
        alpha = np.maximum(alpha, np.asarray(fringe, dtype=np.uint8))

    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    frame.putalpha(Image.fromarray(alpha, mode="L"))
    return frame


def main() -> None:
    arrival = build_arrival_field()
    sprite = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))
    reveal_sprite = Image.new("RGBA", sprite.size, (234, 220, 185, 255))

    for index in range(FRAME_COUNT):
        is_final = index == FRAME_COUNT - 1
        normalized = index / (FRAME_COUNT - 2)
        progress = 0.025 + 0.94 * np.power(normalized, 0.82)
        frame = render_frame(arrival, float(progress), is_final)
        sprite.alpha_composite(frame, (index * FRAME_SIZE, 0))

        reveal_frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (234, 220, 185, 255))
        reveal_frame.putalpha(Image.eval(frame.getchannel("A"), lambda alpha: 255 - alpha))
        reveal_sprite.paste(reveal_frame, (index * FRAME_SIZE, 0))

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(OUTPUT_PATH, format="PNG", optimize=True, compress_level=9)
    reveal_sprite.save(REVEAL_OUTPUT_PATH, format="PNG", optimize=True, compress_level=9)
    print(f"Generated {OUTPUT_PATH} ({sprite.width}x{sprite.height}, {FRAME_COUNT} frames)")
    print(f"Generated {REVEAL_OUTPUT_PATH} ({reveal_sprite.width}x{reveal_sprite.height}, {FRAME_COUNT} frames)")


if __name__ == "__main__":
    main()
