USE mantix;

CREATE TABLE IF NOT EXISTS assets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    asset_code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    location VARCHAR(150) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_assets_asset_code UNIQUE (asset_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    asset_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_work_orders_asset_created (asset_id, created_at),
    INDEX idx_work_orders_status_created (status, created_at),
    CONSTRAINT fk_work_orders_asset
        FOREIGN KEY (asset_id) REFERENCES assets (id)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_work_orders_completion
        CHECK ((status = 'COMPLETED' AND completed_at IS NOT NULL)
            OR (status <> 'COMPLETED' AND completed_at IS NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS work_order_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    work_order_id BIGINT UNSIGNED NOT NULL,
    event_type ENUM('CREATED', 'STATUS_CHANGED', 'NOTE_ADDED') NOT NULL,
    previous_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NULL,
    new_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NULL,
    note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_work_order_events_order_created (work_order_id, created_at),
    CONSTRAINT fk_work_order_events_order
        FOREIGN KEY (work_order_id) REFERENCES work_orders (id)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_work_order_events_status
        CHECK ((event_type = 'STATUS_CHANGED'
                AND previous_status IS NOT NULL
                AND new_status IS NOT NULL
                AND previous_status <> new_status)
            OR (event_type <> 'STATUS_CHANGED'
                AND previous_status IS NULL
                AND new_status IS NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
